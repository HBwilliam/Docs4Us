<template>
    <div>
      <button @click="showModal" class="add-doc-button">+ Add Document</button>
      <Modal :isVisible="isModalVisible" @close="hideModal">
        <UploadMD />
      </Modal>
      <ListDoc />
    </div>
  </template>
  
  <script>
  import UploadMD from '../components/UploadMD.vue';
  import ListDoc from '../components/ListDoc.vue';
  import Modal from '../components/Modal.vue'; // Import the Modal component
  
  export default {
    name: 'HomeView',
    components: {
      UploadMD,
      ListDoc,
      Modal, // Register the Modal component
    },
    data() {
      return {
        isModalVisible: false, // Control the visibility of the modal
      };
    },
    methods: {
      showModal() {
        this.isModalVisible = true; // Show the modal
      },
      hideModal() {
        this.isModalVisible = false; // Hide the modal
      },
    },
  };
  </script>
  
  <style scoped>
  .add-doc-button {
    position: absolute; /* Position it at the top right */
    top: 20px;
    right: 20px;
    padding: 10px 15px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .add-doc-button:hover {
    background-color: #0056b3; /* Darker shade on hover */
  }
  </style>
  