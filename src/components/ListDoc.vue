<template>
  <div>
    <h1>Documents in {{ selectedCategory }}</h1>

    <div v-if="isLoading">Loading documents...</div>
    <div v-else>
      <ul v-if="docs.length > 0">
        <li v-for="doc in docs" :key="doc.id" :ref="'doc-' + doc.id" :id="'doc-' + doc.id">
          <br />
          <h2>{{ doc.title }}</h2>
          <SingleDoc v-if="doc.content" :content="doc.content" />
          <div v-else>Content not available</div>
          <br />
          <hr />
        </li>
      </ul>
      <div v-else v-if="!hasProjects">
        <p>You haven't joined a project yet, consider adding one <router-link to="/add-project">here</router-link>.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SingleDoc from './SingleDoc.vue';
import { useSubjectsStore } from '../stores/subjects';
import { onMounted, ref, watch, computed, nextTick } from 'vue';
import cookies from 'vue-cookies';

export default {
  name: 'ListDoc',
  components: {
    SingleDoc,
  },
  setup() {
    const subjectsStore = useSubjectsStore();
    const categories = ref([]);
    const docs = ref([]);
    const isLoading = ref(false); // Track loading state

    const selectedCategory = computed({
      get() {
        return subjectsStore.selectedSubject;
      },
      set(value) {
        subjectsStore.setSelectedSubject(value);
      }
    });

    const focusDoc = computed(() => subjectsStore.selectedDoc);

    // Check if the current project cookie is empty or absent
    const hasProjects = computed(() => {
      const currentProjectUrl = cookies.get('currentProjectUrl');
      return !!currentProjectUrl; // Returns true if the cookie is set and not empty
    });

    onMounted(async () => {
      await subjectsStore.fetchSubjects();
      categories.value = subjectsStore.subjects;

      if (categories.value.length > 0) {
        selectedCategory.value = categories.value[0];
        await fetchDocs();
      }
    });

    const fetchDocs = async () => {
      if (!selectedCategory.value) return;

      isLoading.value = true; // Set loading state to true

      // Get the current project URL from cookies
      const baseUrl = cookies.get('currentProjectUrl');

      try {
        // Update API call to use currentProjectUrl
        const response = await axios.get(`${baseUrl}/docs/${selectedCategory.value}`);
        docs.value = response.data.docs;

        // Fetch content for each document
        const contentPromises = docs.value.map(async (doc) => {
          try {
            const contentResponse = await axios.get(doc.content); // Ensure doc.content has the full URL
            doc.content = contentResponse.data;
          } catch (error) {
            console.error(`Error fetching content for ${doc.title}:`, error);
            doc.content = 'Error loading content'; // Fallback content
          }
        });

        // Wait for all content to be fetched
        await Promise.all(contentPromises);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        isLoading.value = false; // Reset loading state
      }
    };

    // Watch for selectedCategory change and fetch documents
    watch(selectedCategory, async (newCategory) => {
      if (newCategory) {
        await fetchDocs();
      }
    });

    // Watch for focusDoc change to scroll to the selected document
    watch(focusDoc, async (newDocId) => {
      if (newDocId) {
        await fetchDocs();
        await nextTick(); // Ensure DOM is updated before trying to scroll
        const docElement = document.getElementById(`doc-${newDocId}`);
        if (docElement) {
          console.log('Scrolling to:', docElement);
          docElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Reset focusDoc after scrolling
          subjectsStore.setSelectedDoc(null); // Assuming you have this method in your store
        } else {
          console.error(`Element with id "doc-${newDocId}" not found!`);
        }
      }
    });

    return {
      categories,
      docs,
      selectedCategory,
      focusDoc,
      isLoading, // Return isLoading to use in the template
      hasProjects, // Include hasProjects in the return object
    };
  },
};
</script>

<style scoped>
ul {
  list-style-type: none; /* Remove bullet points */
}

li {
  margin-bottom: 10px; /* Optional: Add spacing between list items */
}
</style>
