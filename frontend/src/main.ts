import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import LoginView from './views/LoginView.vue'
import ChatView from './views/ChatView.vue'
import ColorShowcase from './components/common/ColorShowcase.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/chat', component: ChatView },
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
