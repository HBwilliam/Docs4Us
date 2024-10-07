<template>
    <div class="invite-container">
      <h1>You've been invited to join a project!</h1>
      <div v-if="projectName && projectUrl">
        <p>Project Name: <strong>{{ projectName }}</strong></p>
        <p>Project URL: <a :href="projectUrl" target="_blank">{{ projectUrl }}</a></p>
        <button @click="acceptInvite">Accept Invite</button>
      </div>
      <div v-else>
        <p>Invalid project invite link.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { useRoute, useRouter } from 'vue-router';
  import { useProjectsStore } from '../stores/projects';
  
  export default {
    name: 'InviteView',
    setup() {
      const route = useRoute();
      const router = useRouter();
      const projectsStore = useProjectsStore();
  
      const projectName = route.query.name || '';
      const projectUrl = route.query.url || '';
  
      const acceptInvite = () => {
        if (projectName && projectUrl) {
          projectsStore.addProjectFromInvite(projectName, projectUrl);
  
          // Optional: Redirect back to the projects page
          router.push('/');
        }
      };
  
      return {
        projectName,
        projectUrl,
        acceptInvite,
      };
    },
  };
  </script>
  
  <style scoped>
  .invite-container {
    text-align: center;
    padding: 20px;
  }
  
  button {
    padding: 10px 15px;
    background-color: #165c26;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #11471e;
  }
  </style>
  