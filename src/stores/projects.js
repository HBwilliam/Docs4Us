// stores/projects.js
import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [], // Store project objects
    currentProjectUrl: '', // Store the current project's URL
  }),
  actions: {
    async fetchProjects() {
        try {
            const currentProjectUrl = Cookies.get('currentProjectUrl');
            if (currentProjectUrl) {
                this.currentProjectUrl = currentProjectUrl;
                console.log('Fetched current project URL:', this.currentProjectUrl);
            }
            const projects = Cookies.get('projects');
            if (projects) {
                this.projects = JSON.parse(projects);
                console.log('Fetched projects:', this.projects);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    },
    addProject(name, url) {
    if (!name || !url) {
        console.error('Name and URL are required');
    } else if (this.projects.some(project => project.url === url)) {
        console.error('Project already exists');
    } else if (this.projects.some(project => project.name === name)) {
        console.error('Project with the same name already exists');
    } else {
        this.projects.push({ name, url });
        console.log('Added project:', name, url);
        Cookies.set('currentProjectUrl', url);
        Cookies.set('projects', JSON.stringify(this.projects));
        console.log(Cookies.get('projects'));
    }
    },
    addProjectFromInvite(name, url) {
        // Extract project name from URL or add a default name
        this.addProject(name, url);
  
        // Set the project in cookies
        Cookies.set('currentProjectUrl', url);
        Cookies.set('projects', JSON.stringify(this.projects));
      },
    switchProject(url) {
      this.currentProjectUrl = url;
      Cookies.set('currentProjectUrl', url);
    },
    getCurrentProjectUrl(){
        return this.currentProjectUrl;
    }
  },
});
