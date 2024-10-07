<template>
    <div class="main">
        <LeftBar />
        <RouterView class="router-view" />
    </div>
</template>

<script>
    import LeftBar from './components/LeftBar.vue';
    import { RouterView } from 'vue-router';

    export default {
        name: 'App',
        components: {
            RouterView,
            LeftBar,
        },
    }
</script>

<style scoped>
    .main {
        display: flex;
        flex-direction: row;
        height: 100vh; /* Optional: ensures full height */
    }
    .router-view {
        flex: 1; /* Make RouterView take up the remaining space */
        margin-left: 200px; /* Optional: ensure it doesn't overlap with LeftBar */
        padding: 20px; /* Optional: add padding for aesthetics */
    }
</style>

