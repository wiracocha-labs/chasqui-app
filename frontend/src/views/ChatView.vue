<template>
  
    <!-- Left Sidebar - Workspace Icons -->
  <div class="main-container flex flex-row h-screen overflow-hidden bg-bg-primary">
  <!-- Sidebar como componente fijo -->
  <AppSidebar />
    
  <!-- Contenido principal con margen para el sidebar fijo -->
  <div class="flex flex-row flex-1 ml-20">
    <!-- Middle Sidebar - Channels and DMs -->
    <div class="middle-sidebar w-[260px] min-w-[260px] flex flex-col border-r border-brand-20 bg-terciary px-3 py-4 shadow-md">
    <div class="flex flex-col gap-4">
      <!-- Chat header -->
      <!-- MOCK: Sidebar Profile (Emilio Gutiérrez) -->
      <div class="mb-6 flex items-center gap-3">
        <!-- Profile Avatar Box -->
        <div class="w-12 h-12 rounded-lg bg-slate-700 flex-shrink-0 border border-brand-20 flex items-center justify-center overflow-hidden">
          <img src="../assets/images/chasqui_avatar1.webp" alt="Emilio Gutiérrez" class="w-full h-full object-cover">
        </div>
        <div class="flex-auto">
          <h1 class="font-semibold text-lg leading-tight truncate text-white">Emilio Gutiérrez</h1>
          <div class="flex items-center mt-1">
            <div class="status-badge">
              <span class="dot"></span>
              Billetera conectada
            </div>
          </div>
        </div>
      </div>
      <!-- MOCK: Conversations List (Startup Mock) -->
      <div class="mb-6 bg-brand-10 text-white rounded-xl">
  <div class="flex justify-between items-center px-3 pb-2 text-white">
          <div class="font-semibold text-[14px] text-white">Conversaciones</div>
          <div class="flex-shrink-0 sidebar-svg-wrapper flex items-center justify-center">
            <svg class="w-4 h-4 opacity-50 fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
  <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] bg-accent text-white shadow-sm font-bold flex items-center gap-2">
            <span class="opacity-50">#</span> bug contrato inteligente
          </div>
          <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] text-white/70 hover:bg-brand-10 flex items-center gap-2">
            <span class="opacity-30">#</span> general
          </div>
          <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] text-white/70 hover:bg-brand-10 flex items-center gap-2">
            <span class="opacity-30">#</span> marketing-y-ventas
          </div>
          <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] text-white/70 hover:bg-brand-10 flex items-center gap-2">
            <span class="opacity-30">#</span> backend-api
          </div>
          <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] text-white/70 hover:bg-brand-10 flex items-center gap-2">
            <span class="opacity-30">#</span> infraestructura-cli
          </div>
          <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] text-white/70 hover:bg-brand-10 flex items-center gap-2">
            <span class="opacity-30">#</span> off-topic
          </div>
          <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] text-white/70 hover:bg-brand-10 flex items-center gap-2">
            <span class="opacity-30">#</span> despliegue mainnet
          </div>
          <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] text-white/70 hover:bg-brand-10 flex items-center gap-2">
            <span class="opacity-30">#</span> frontend refactor
          </div>
          <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] text-white/70 hover:bg-brand-10 flex items-center gap-2">
            <span class="opacity-30">#</span> diseño ux v2
          </div>
      </div>
      <!-- Direct Messages -->
  <div class="mb-6 bg-brand-10 text-white rounded-xl">
  <div class="flex justify-between items-center px-3 pb-2 text-white">
          <div class="font-semibold text-[14px] text-white">Mensajes directos</div>
          <div class="flex-shrink-0 sidebar-svg-wrapper flex items-center justify-center">
            <svg class="w-4 h-4 opacity-50 fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
        <div class="flex items-center mb-2 px-3 cursor-pointer text-[14px]">
          <span class="rounded-full block w-2 h-2 mr-2 flex-shrink-0 bg-brand"></span>
          <span class="font-semibold text-white">Emilio Gutiérrez</span>
        </div>
        <div class="flex items-center mb-2 px-3 cursor-pointer text-[14px]">
          <span class="rounded-full block w-2 h-2 mr-2 flex-shrink-0 bg-brand"></span>
          <span class="font-semibold text-white">David Hemphill</span>
        </div>
        <div class="flex items-center px-3 mb-4 opacity-80 cursor-pointer text-[14px]">
          <span class="border border-brand rounded-full block w-2 h-2 mr-2 flex-shrink-0"></span>
          <span class="font-semibold text-white">Steve Schoger</span>
        </div>
      </div>
      <!-- Apps -->
      <div class="text-white rounded-xl">
        <div class="flex justify-between items-center px-3 pb-2 text-white bg-brand-10 rounded-xl">
          <div class="font-semibold text-[14px] text-white">Apps</div>
          <div class="flex-shrink-0 sidebar-svg-wrapper flex items-center justify-center text-white">
            <svg class="w-4 h-4 opacity-50 fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
    
    <!-- Chat content -->
  <!-- Chat Content -->
      <!-- MOCK: Chat Header Title -->
      <div class="flex-1 flex flex-col h-screen overflow-hidden bg-bg-primary">
      <!-- Top bar -->
  <!-- Top Bar -->
  <div class="flex items-center flex-shrink-0 px-4 py-3 border-b border-brand-20 bg-brand-10">
        <div style="display: flex; flex-direction: column;">
          <h3 class="mb-1 font-extrabold text-[18px] text-color-brand"># bug contrato inteligente</h3>
          <!-- <div class="text-xs">
            <span :class="isConnected ? 'text-green-500' : 'text-red-500'">
              {{ isConnected ? 'Conectado' : 'Desconectado' }}
            </span>
          </div> -->
        </div>
        <div class="flex ml-auto relative">
          <input 
            type="search" 
            placeholder="Buscar..." 
            class="appearance-none border rounded-lg px-8 py-2 outline-none w-[200px] bg-secondary text-color-textSecondary border-brand-20" 
          >
          <div class="sidebar-svg-wrapper flex items-center justify-center">
            <svg class="w-4 h-4 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
            </svg>
          </div>
        </div>
      </div>
        
        <!-- Chat messages -->
  <div class="px-4 py-4 flex-1 overflow-y-scroll message-container bg-bg-primary" ref="messagesContainer">
          <!-- Loading state -->
          <!-- <div v-if="isLoading" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 border-brand-60"></div>
              <p class="text-sm text-color-textSecondary">Cargando mensajes...</p>
            </div>
          </div> -->

          <!-- Error state -->
          <!-- <div v-else-if="error" class="flex items-center justify-center h-full">
            <div class="border px-6 py-4 rounded-lg text-center max-w-md mx-4 bg-action-10 border-action text-action">
              <div class="font-semibold mb-2">¡Error de conexión!</div>
              <div class="text-sm mb-4">{{ error }}</div>
              <button 
                @click="loadMessages"
                class="font-medium py-2 px-4 rounded text-sm transition-colors hover:opacity-80 bg-action text-color-textPrimary"
              >
                Reintentar
              </button>
            </div>
          </div> -->

          <!-- Welcome message -->
          <!-- <div v-if="messages.length === 0" class="text-center py-8">
            <div class="text-2xl mb-2">💬</div>
            <h3 class="text-base font-semibold mb-1 text-color-brand">¡Bienvenido al chat!</h3>
            <p class="text-xs opacity-75 text-color-textSecondary">No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div> -->
          
           <!-- MOCK: Conversations & Smart Contract Card for Video Carousel -->
          <!-- Messages list (Mocked for Video Carousel) -->
          <div class="space-y-6">
            <!-- MONDAY HISTORY -->
            <div class="day-separator">
              <div class="line"></div>
              <div class="day-text">Lunes, 23 de febrero</div>
              <div class="line"></div>
            </div>

            <!-- GitHub Bot: PR Opened -->
            <div class="ml-16 py-1">
              <div class="github-bot-card pr-opened">
                <div class="bot-icon">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </div>
                <div class="bot-details">
                  <div class="bot-header">
                    <span class="bot-name">github</span>
                    <span class="px-1 bg-gray-700/50 rounded text-[10px] leading-none py-0.5">APP</span>
                    <span>•</span>
                    <span>10:05 AM</span>
                  </div>
                  <div class="bot-action">
                    Pull request opened: <span class="repo-link">wiracocha-labs/chasqui-app#42</span>
                    <div class="mt-1 font-bold text-white text-[15px]">feat: update smart contract for treasury management</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message: Emilio Gutiérrez 1 -->
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-700 flex-shrink-0 border-2 border-brand-20 overflow-hidden flex items-center justify-center">
                <img src="../assets/images/chasqui_avatar1.webp" alt="Emilio Gutiérrez" class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="font-bold text-white text-[15px]">Emilio Gutiérrez</span>
                  <span class="text-[12px] opacity-40">10:12</span>
                </div>
                <div class="text-[15px] leading-relaxed text-gray-200">
                  Revisando el PR ahora. Los cambios en la lógica de validación se ven sólidos. 🛡️
                </div>
              </div>
            </div>

            <!-- GitHub Bot: PR Merged -->
            <div class="ml-16 py-1">
              <div class="github-bot-card pr-merged">
                <div class="bot-icon">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </div>
                <div class="bot-details">
                  <div class="bot-header">
                    <span class="bot-name">github</span>
                    <span class="px-1 bg-gray-700/50 rounded text-[10px] leading-none py-0.5">APP</span>
                    <span>•</span>
                    <span>11:45 AM</span>
                  </div>
                  <div class="bot-action">
                    Pull request merged: <span class="repo-link">wiracocha-labs/chasqui-app#42</span>
                    <div class="mt-1 text-white/70">Merged into <span class="repo-link">main</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- THURSDAY HISTORY -->
            <div class="day-separator">
              <div class="line"></div>
              <div class="day-text">Hoy</div>
              <div class="line"></div>
            </div>

            <!-- Message 1: Matias Pérez -->
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-700 flex-shrink-0 border-2 border-brand-20 overflow-hidden flex items-center justify-center">
                <img src="../assets/images/chasqui_avatar2.webp" alt="Matias Pérez" class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="font-bold text-white text-[15px]">Matias Pérez</span>
                  <span class="text-[12px] opacity-40">10:21</span>
                </div>
                <div class="text-[15px] leading-relaxed text-gray-200">
                  Acabo de terminar las <span class="font-bold">pruebas finales</span> del contrato inteligente. Todo está funcionando perfectamente. Lo he revisado varias veces y todo se ve <span class="inline-block bg-green-500/20 px-1 rounded">✅</span>
                </div>
              </div>
            </div>

            <!-- Message 2: Emilio Gutiérrez -->
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-700 flex-shrink-0 border-2 border-brand-20 overflow-hidden flex items-center justify-center">
                <img src="../assets/images/chasqui_avatar1.webp" alt="Emilio Gutiérrez" class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="font-bold text-white text-[15px]">Emilio Gutiérrez</span>
                  <span class="text-[12px] opacity-40">10:23</span>
                </div>
                <div class="text-[15px] leading-relaxed text-gray-200">
                  Perfecto Matias! Excelente trabajo. Ya podemos liberar <span class="font-bold">el pago final</span>. 🛠️✨ Revisé el contrato y se ve perfecto. Ya podemos hacer el despliegue final. 🔗⛓️
                </div>
              </div>
            </div>

            <!-- Message 3: Smart Contract executed card -->
            <div class="ml-16 py-2">
              <div class="sc-executed-card">
                <div class="highlight"></div>
                
                <div class="icon-box">
                  <!-- Shield icon placeholder -->
                  <svg class="w-8 h-8 text-brand" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                </div>
                
                <div>
                  <div class="title-box">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0110 0v4"></path>
                    </svg>
                    <span>Smart Contract ejecutado</span>
                  </div>
                  <div class="content-text">
                    <span class="font-bold">Pago liberado automáticamente:</span> <span class="text-brand font-black">400 USDC</span> depositados correctamente en la billetera <span class="font-mono opacity-80">0xabe...cd3f</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message 4: Matias Pérez response -->
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-700 flex-shrink-0 border-2 border-brand-20 overflow-hidden flex items-center justify-center">
                <img src="../assets/images/chasqui_avatar2.webp" alt="Matias Pérez" class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="font-bold text-white text-[15px]">Matias Pérez</span>
                  <span class="text-[12px] opacity-40">10:25</span>
                </div>
                <div class="text-[15px] leading-relaxed text-gray-200">
                  ¡Pago recibido en mi billetera! Gracias Emilio, ¡todo perfecto! 🤙✨
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pb-6 px-4 flex-none">
          <form @submit.prevent="sendMessage" class="flex rounded-lg border-2 overflow-hidden border-accent bg-accent-10">
            <input 
              v-model="inputMessage"
              type="text" 
              class="flex-1 px-4 py-2 focus:outline-none bg-secondary text-black" 
              placeholder="Escribe un mensaje..." 
              autocomplete="off"
              :disabled="!isConnected"
            >
            <button 
              type="submit"
              :disabled="!inputMessage.trim() || !isConnected"
              class="px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 bg-action text-color-textPrimary"
            >
              Enviar
            </button>
          </form>
          <!-- <div class="text-xs mt-1">
            <span :class="isConnected ? 'text-green-500' : 'text-red-500'">
              {{ isConnected ? '● Conectado' : '● Desconectado' }}
            </span>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '../components/ui/AppSidebar.vue'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'

// Types
type Message = {
  text: string
  sender: string
  timestamp: number
}

type OnlineUser = {
  id: string
  name: string
}

// Auth store
const authStore = useAuthStore()

// Reactive data
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isConnected = ref(false)
const isLoading = ref(true)
const error = ref<string | null>(null)
const messagesContainer = ref<HTMLDivElement>()
const onlineUsers = ref<OnlineUser[]>([
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
])

// GunDB instance
let gun: any = null
let messagesRef: any = null
let username = ''

// Utility functions
const formatAddress = (address: string | null) => {
  if (!address) return 'Usuario Anónimo'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Initialize GunDB
const initializeGun = () => {
  if (typeof window !== 'undefined' && (window as any).Gun) {
    gun = (window as any).Gun({
      localStorage: false,
      radisk: true,
      uuid: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
      }
    })

    messagesRef = gun.get('chasqui-chat-messages')
    isConnected.value = true
    
    // Setup username
    username = formatAddress(authStore.address) || 'user-' + Math.random().toString(36).substr(2, 8)
    
    console.log('GunDB initialized successfully')
    return true
  } else {
    error.value = 'GunDB no está disponible en window. Verifica la carga del script en index.html.'
    isConnected.value = false
    return false
  }
}

// Load existing messages
const loadMessages = async () => {
  if (!gun || !messagesRef) {
    if (!initializeGun()) {
      isLoading.value = false
      return
    }
  }

  try {
    error.value = null
    isLoading.value = true
    
    // Listen for new messages
    messagesRef.map().on((data: any, id: string) => {
      if (data && data.text && data.sender && data.timestamp) {
        // Check if message already exists
        const existingIndex = messages.value.findIndex(msg => 
          msg.text === data.text && 
          msg.sender === data.sender && 
          Math.abs(msg.timestamp - data.timestamp) < 1000
        )
        
        if (existingIndex === -1) {
          messages.value.push({
            text: data.text,
            sender: data.sender,
            timestamp: data.timestamp
          })
          
          // Sort messages by timestamp
          messages.value.sort((a, b) => a.timestamp - b.timestamp)
          
          // Auto-scroll to bottom for new messages
          setTimeout(scrollToBottom, 100)
        }
      }
    })

    isConnected.value = true
  } catch (err) {
    console.error('Error loading messages:', err)
    error.value = 'No se pudieron cargar los mensajes'
    isConnected.value = false
  } finally {
    isLoading.value = false
  }
}

// Send message
const sendMessage = async () => {
  if (!inputMessage.value.trim() || !isConnected.value || !messagesRef) {
    return
  }

  try {
    const messageData = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      text: inputMessage.value.trim(),
      sender: username,
      timestamp: Date.now()
    }

    // Add to GunDB
    messagesRef.get(messageData.id).put(messageData, (ack: any) => {
      if (ack.err) {
        console.error('Error sending message:', ack.err)
        error.value = 'Error al enviar el mensaje'
      } else {
        console.log('Message sent successfully')
      }
    })

    // Mostrar el mensaje inmediatamente en la lista
    messages.value.push({
      text: messageData.text,
      sender: messageData.sender,
      timestamp: messageData.timestamp
    })
    messages.value.sort((a, b) => a.timestamp - b.timestamp)

    // Clear input
    inputMessage.value = ''

    // Scroll to bottom
    setTimeout(scrollToBottom, 100)

  } catch (err) {
    console.error('Error sending message:', err)
    error.value = 'Error al enviar el mensaje'
  }
}

// Clean up old messages (run periodically)
const cleanupOldMessages = () => {
  if (!messagesRef) return
  
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  
  messagesRef.map().once((data: any, id: string) => {
    if (data && data.timestamp && data.timestamp < oneDayAgo) {
      gun.get('chasqui-chat-messages').get(id).put(null)
    }
  })
}

// Lifecycle
onMounted(async () => {
  try {
    await loadMessages()
    
    // Setup periodic cleanup
    setInterval(cleanupOldMessages, 60 * 60 * 1000) // Every hour
    
    // Focus on input when component mounts
    nextTick(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
      if (inputElement) {
        inputElement.focus()
      }
    })
    
  } catch (err) {
    console.error('Error setting up chat:', err)
    error.value = 'Error al inicializar el chat'
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Cleanup if needed
  if (gun) {
    gun.off()
  }
})
</script>
