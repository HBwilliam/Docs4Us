import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import AddProjectView from '../views/AddProjectView.vue'
import InviteView from '../views/InviteView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add-project',
    name: 'AddProject',
    component: AddProjectView
  },
  {
    path: '/invite',
    name: 'Invite',
    component: InviteView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
