<template>
    <div class="left-bar">
      <div class="top">
        <div class="left-bar-header">
          <h2>Categories</h2>
        </div>
        <div class="left-bar-content">
          <ul>
            <li v-for="category in categories" :key="category">
              <div class="category-item">
                <span @click="onCategoryChange(category)">
                  {{ category }}
                </span>
                <span class="arrow" @click="toggleDocs(category)">
                  {{ expandedCategory === category ? '▼' : '▶' }}
                </span>
              </div>
  
              <ul v-if="expandedCategory === category" class="doc-titles">
                <li v-for="doc in docs[category]" :key="doc.id" @click="jumptodoc(doc.id, category)">
                  {{ doc.title }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
  
      <div class="projects">
        <div v-if="expandedProjects" class="projects-list">
          <ul class="project-titles">
            <li v-for="project in projects" :key="project.url" @click="switchProject(project.url)">
              {{ project.name }}
            </li>
            <router-link to="/add-project">
              <li>Project Settings</li>
            </router-link>
          </ul>
        </div>
        <span class="arrow2" @click="toggleProjects()">
          <h2>Projects</h2>
          {{ expandedProjects ? '▲' : '▶' }}
        </span>
      </div>
    </div>
  </template>
  
  <script>
  import { useSubjectsStore } from '../stores/subjects';
  import { useProjectsStore } from '../stores/projects';
  import { onMounted, ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router'; // Import Vue Router
  import axios from 'axios';
  import cookies from 'vue-cookies';
  
  export default {
    name: 'LeftBar',
    setup() {
      const subjectsStore = useSubjectsStore();
      const projectsStore = useProjectsStore();
      const router = useRouter(); // Get the router instance
  
      const expandedCategory = ref(null);
      const expandedProjects = ref(false);
      const docs = ref({});
  
      // Computed to ensure reactivity with store changes
      const categories = computed(() => subjectsStore.subjects);
      const projects = computed(() => projectsStore.projects);
  
      onMounted(async () => {
        // Fetch the initial project and subjects
        await projectsStore.fetchProjects();
        await subjectsStore.fetchSubjects();
        if (categories.value.length > 0) {
          subjectsStore.setSelectedSubject(categories.value[0]);
        }
      });
  
      const onCategoryChange = (category) => {
        subjectsStore.setSelectedSubject(category);
      };
  
      const jumptodoc = async (id, category) => {
        subjectsStore.setSelectedSubject(category);
        subjectsStore.setSelectedDoc(id);
      };
  
      const toggleDocs = async (category) => {
        if (expandedCategory.value === category) {
          expandedCategory.value = null;
        } else {
          expandedCategory.value = category;
          if (!docs.value[category]) {
            await fetchDocs(category);
          }
        }
      };
  
      const toggleProjects = () => {
        expandedProjects.value = !expandedProjects.value;
      };
  
      const switchProject = async (url) => {
        expandedCategory.value = null;
        projectsStore.switchProject(url);
        cookies.set('currentProjectUrl', url); // Set the new project URL
        subjectsStore.clearSubjects(); // Clear old subjects
        docs.value = {}; // Clear old docs
        await subjectsStore.fetchSubjects(); // Fetch new subjects
  
        // Check the current route and redirect if necessary
        if (router.currentRoute.value.path === '/add-project') {
          router.push('/'); // Redirect to home
        } else {
          // Fetch docs for the first category
          if (categories.value.length > 0) {
            await fetchDocs(categories.value[0]); // Fetch docs for the first category
          }
        }
      };
  
      const fetchDocs = async (category) => {
        const baseUrl = cookies.get('currentProjectUrl');
        try {
          const response = await axios.get(`${baseUrl}/docs/${category}`);
          docs.value[category] = response.data.docs.map(doc => ({ id: doc.id, title: doc.title }));
        } catch (error) {
          console.error(`Error fetching documents for category ${category}:`, error);
        }
      };
  
      watch(categories, async (newCategories) => {
        if (newCategories.length > 0) {
          await fetchDocs(newCategories[0]);
        }
      });
  
      return {
        categories,
        expandedCategory,
        docs,
        expandedProjects,
        onCategoryChange,
        toggleDocs,
        jumptodoc,
        toggleProjects,
        switchProject,
        projects,
      };
    },
  };
  </script>

<style scoped>
.left-bar {
    position: fixed; /* Fix the position to the left */
    top: 0; /* Align to the top of the viewport */
    left: 0; /* Align to the left of the viewport */
    width: 200px; /* Set a fixed width */
    height: 100vh; /* Set height to fill the viewport */
    padding: 20px;
    border-right: 1px solid #ccc;
    overflow-y: auto; /* Add vertical scroll if content overflows */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.left-bar-header {
    margin-bottom: 20px;
}

.left-bar-content {
    padding-left: 10px;
}

.left-bar-content ul {
    list-style-type: none;
    padding: 0;
}

.left-bar-content li {
    cursor: pointer;
    padding: 5px 0;
}

.left-bar-content li.active {
    font-weight: bold;
}

.category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.arrow {
    font-size: 14px;
    margin-left: 10px;
}

.doc-titles {
    padding-left: 15px;
    font-size: 14px;
}

.projects {
    margin-top: 20px; /* Add some margin above the projects section */
    margin-bottom: 20px; /* Add some margin below the projects section */
}

.projects-list {
    border-radius: 5px;
    border: 1px solid #ccc; /* Border for better visibility */
    padding: 2px; /* Padding around the projects list */
    margin-top: 10px; /* Space between projects header and list */
}

ul {
    list-style-type: none; /* Remove default list styling */
    padding: 0; /* Remove default padding */
}

.arrow2 {
    cursor: pointer; /* Change cursor to pointer for better UX */
    display: flex;
    justify-content: space-around;
    align-items: center; /* Center align */
}
</style>
