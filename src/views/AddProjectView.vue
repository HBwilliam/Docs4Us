<template>
    <div class="all">
      <router-link to="/">
        <button class="back">Back to Home</button>
      </router-link>
      <div class="add-project-container">
        <h1>Add a New Project</h1>
        <div class="form-container">
          <input v-model="projectName" placeholder="Project Name" />
          <input v-model="projectUrl" placeholder="Project URL" />
          <button class="add" @click="addNewProject">Add Project</button>
        </div>
  
        <div class="projects-table">
          <h2>Existing Projects</h2>
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project URL</th>
                <th>Invite Link</th> <!-- New column for the invite link -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(project, index) in projects" :key="index">
                <td>{{ project.name }}</td>
                <td><a :href="project.url" target="_blank">{{ project.url }}</a></td>
                <td>
                  <button @click="copyInviteLink(project.name, project.url)">🔗 Copy Invite Link</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  

  <script>
import { useProjectsStore } from '../stores/projects';
import { ref, computed } from 'vue';

export default {
  name: 'AddProjectView',
  setup() {
    const projectsStore = useProjectsStore();
    const projectName = ref('');
    const projectUrl = ref('');

    const projects = computed(() => projectsStore.projects);

    const addNewProject = () => {
      if (projectName.value && projectUrl.value) {
        projectsStore.addProject(projectName.value, projectUrl.value);
        projectName.value = '';
        projectUrl.value = '';
      }
    };

    const copyInviteLink = (projectName, projectUrl) => {
      const inviteLink = `${window.location.origin}/invite?name=${encodeURIComponent(projectName)}&url=${encodeURIComponent(projectUrl)}`;
      navigator.clipboard.writeText(inviteLink).then(() => {
        alert('Invite link copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy invite link.');
      });
    };

    return {
      projectName,
      projectUrl,
      addNewProject,
      projects,
      copyInviteLink,
    };
  },
};
</script>

  

<style scoped>
.add-project-container {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto; /* Center the container horizontally */
    padding: 20px;
    border-radius: 5px;
}

h1,
h2 {
    text-align: center;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

input {
    margin: 5px;
    padding: 10px;
    width: 80%;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.all {
    display: flex;
}

.add {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    background-color: #165c26;
    color: white;
    cursor: pointer;
}

.add:hover {
    background-color: #11471e;
}

.projects-table {
    margin-top: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

.back {
    position: absolute; /* Position it at the top right */
    top: 20px;
    right: 20px;
    padding: 10px 15px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.back:hover {
    background-color: #0056b3;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>
