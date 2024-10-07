  <template>
    <div class="html" v-html="htmlContent"></div>
  </template>
  
  <script>
  import { marked } from 'marked';
  
  export default {
    name: 'SingleDoc',
    props: {
      content: {
        type: String,
        required: true,
      },
    },
    computed: {
      htmlContent() {
        return marked(this.content);
      },
    },
  };
  </script>
  
  <style scoped>
    .html {
        margin-top: 20px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
  </style>
  