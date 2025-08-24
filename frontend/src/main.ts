import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/styles/main.css'
import App from './App.vue'
import LoginView from './views/LoginView.vue'
import ChatView from './views/ChatView.vue'
import TaskManagerView from './views/TaskManagerView.vue'
import ColorShowcase from './components/common/ColorShowcase.vue'
import { useAuthStore } from './stores/auth'

const routes = [
  { path: '/', component: TaskManagerView },
  { path: '/login', component: LoginView },
  { path: '/chat', component: ChatView },
  { path: '/tasks', component: TaskManagerView },
  { path: '/colors', component: ColorShowcase },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

// Initialize auth store after app mount
const authStore = useAuthStore()
authStore.initializeProvider()
