import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/styles/main.css'
import './assets/styles/style.css'
import App from './App.vue'
import LoginView from './views/LoginView.vue'
import ChatView from './views/ChatView.vue'
import TaskManagerView from './views/TaskManagerView.vue'
import ColorShowcase from './components/common/ColorShowcase.vue'
import { useAuthStore } from './stores/auth'

const routes = [
  { path: '/login', component: LoginView, name: 'Login' },
  { path: '/', redirect: '/chat' },
  { path: '/chat', component: ChatView, name: 'Chat', meta: { requiresAuth: true } },
  { path: '/tasks', component: TaskManagerView, name: 'Tasks', meta: { requiresAuth: true } },
  { path: '/colors', component: ColorShowcase, name: 'Colors' }, // Ruta de desarrollo
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

// Auth guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Verificar si el usuario está autenticado
    if (!authStore.address) {
      // Redirigir a login si no está autenticado
      next('/login')
      return
    }
  }
  
  // Si está autenticado y trata de acceder a login, redirigir al chat
  if (to.name === 'Login' && authStore.address) {
    next('/chat')
    return
  }
  
  next()
})

app.mount('#app')

// Initialize auth store after app mount
const authStore = useAuthStore()
authStore.initializeProvider()
