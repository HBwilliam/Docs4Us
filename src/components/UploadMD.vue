<template>
    <div class="all">
        <h1>Upload Markdown</h1>
        <form @submit.prevent="onUpload">
            <p>Select your markdown file:</p>
            <input type="file" @change="onFileChange" accept=".md" />
            <br />
            <label for="Title">Title:</label>
            <input type="text" id="Title" v-model="title" />
            <br />
            <label for="Subject">Pick your category:</label>
            <select name="Subject" id="Subject" v-model="selectedSubject">
                <option disabled value="">Please select one</option> <!-- Placeholder option -->
                <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
            </select>
            <br />
            <button type="submit">Upload</button>
        </form>
        <div v-if="uploadResponse">
            <p>File uploaded successfully! Link: <a :href="uploadResponse">{{ uploadResponse }}</a></p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useSubjectsStore } from '../stores/subjects';
import { ref, onMounted } from 'vue';
import cookies from 'vue-cookies';

export default {
    name: 'UploadMD',
    setup() {
        // Access the subjects store
        const subjectsStore = useSubjectsStore();

        // Fetch subjects when the component is mounted
        onMounted(async () => {
            await subjectsStore.fetchSubjects();
        });

        // Local state
        const title = ref('');
        const selectedSubject = ref('');
        const file = ref(null);
        const uploadResponse = ref('');

        // File change handler
        const onFileChange = (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                file.value = selectedFile;
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Optional: You might want to handle the content if needed
                    // content.value = e.target.result;
                };
                reader.readAsText(selectedFile);
            }
        };

        // Upload handler
        const onUpload = async () => {
            if (!title.value || !file.value || !selectedSubject.value) {
                console.error('Title, selected subject, or file is missing.');
                return;
            }

            const formData = new FormData();
            formData.append('title', title.value);
            formData.append('subject', selectedSubject.value);
            formData.append('file', file.value);

            // Get the current project URL from cookies
            const baseUrl = cookies.get('currentProjectUrl');

            try {
                // Update API call to use currentProjectUrl
                const response = await axios.post(`${baseUrl}/api/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('File uploaded successfully:', response.data);
                uploadResponse.value = response.data.link; // Assuming your API returns a link
            } catch (error) {
                console.error('Error uploading file:', error);
            }

            // Optionally, you can send the markdown content after the upload
            if (uploadResponse.value) {
                try {
                    const response = await axios.post(`${baseUrl}/docs`, {
                        title: title.value,
                        category: selectedSubject.value,
                        content: uploadResponse.value,
                    });
                    console.log('Markdown content uploaded successfully:', response.data);
                } catch (error) {
                    console.error('Error uploading markdown content:', error);  
                }
            }
        };

        return {
            subjects: subjectsStore.subjects,
            title,
            selectedSubject,
            file,
            uploadResponse,
            onFileChange,
            onUpload,
        };
    },
};
</script>

<style scoped>
</style>
