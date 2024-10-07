import { defineStore } from "pinia";
import cookies from 'vue-cookies';  // Import vue-cookies to fetch the current project URL

export const useSubjectsStore = defineStore('subjects', {
    state: () => ({
        subjects: [],  // List of categories (subjects)
        selectedSubject: '',  // The currently selected category
        selectedDoc: ''  // The currently selected document
    }),
    actions: {
        // Fetch subjects for the current project
        async fetchSubjects() {
            try {
                const currentProjectUrl = cookies.get('currentProjectUrl');  // Get the current project URL dynamically
                if (!currentProjectUrl) {
                    throw new Error("No project URL found.");
                }

                // Fetch categories from the current project
                const response = await fetch(`${currentProjectUrl}/categories`);
                const data = await response.json();

                // Assuming data.categories is an array like [{ id: 1, name: "Introduction" }, { id: 2, name: "Recaps" }]
                // Map the names into the subjects array
                this.subjects = data.categories.map(category => category.name);

                // Optionally set the first subject as selected by default
                if (this.subjects.length > 0) {
                    this.selectedSubject = this.subjects[0];
                }
                
                console.log('Fetched subjects:', this.subjects);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        },
        setSelectedSubject(subject) {
            this.selectedSubject = subject;  // Set the selected subject
        },
        getSelectedSubject() {
            return this.selectedSubject;  // Return the currently selected subject
        },
        setSelectedDoc(id) {
            this.selectedDoc = id;  // Set the selected document
        },
        getSelectedDoc() {
            return this.selectedDoc;  // Return the selected document
        },
        // Reset subjects and selections when switching projects
        clearSubjects() {
            this.subjects = [];
            this.selectedSubject = '';
            this.selectedDoc = '';
        }
    },
});
