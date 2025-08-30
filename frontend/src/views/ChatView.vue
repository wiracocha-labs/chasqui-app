<template>
  
    <!-- Left Sidebar - Workspace Icons -->
  <div class="main-container flex flex-row h-screen overflow-hidden bg-bg-primary">
    <!-- Left Sidebar -->
  <div class="left-sidebar w-20 min-w-20 p-2 flex flex-col border-r border-brand-20 bg-bg-primary">
      <div class="cursor-pointer mb-3">
  <div class="icon-container sidebar-svg-wrapper text-lg font-semibold rounded-lg mb-1 overflow-hidden bg-brand text-color-textPrimary flex items-center justify-center w-10 h-10 shadow-md">
          C
        </div>
  <div class="text-center opacity-50 text-xs text-brand-80">⌘1</div>
      </div>
      <div class="cursor-pointer mb-3">
  <div class="icon-container sidebar-svg-wrapper opacity-25 text-lg font-semibold rounded-lg mb-1 overflow-hidden bg-accent text-color-textPrimary flex items-center justify-center w-10 h-10 shadow-md">
          L
        </div>
  <div class="text-center opacity-50 text-xs text-accent-60">⌘2</div>
      </div>
      <div class="cursor-pointer">
  <div class="icon-container sidebar-svg-wrapper opacity-25 rounded-lg mb-1 overflow-hidden bg-brand-10 flex items-center justify-center w-10 h-10 shadow-sm">
          <svg class="w-4 h-4 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"/>
          </svg>
        </div>
      </div>
  </div>
    
    <!-- Middle Sidebar - Channels and DMs -->
  <!-- Middle Sidebar -->
  <div class="middle-sidebar w-[260px] min-w-[260px] flex flex-col border-r border-brand-20 bg-brand px-3 py-4 shadow-md">
    <div class="flex flex-col gap-4">
      <!-- Chat header -->
  <div class="mb-4 flex justify-between">
        <div class="flex-auto">
          <h1 class="font-semibold text-lg leading-tight mb-1 truncate">Chasqui Chat</h1>
          <div class="flex items-center mb-4">
            <span class="rounded-full block mr-2 flex-shrink-0 bg-red-300" style="width: 8px; height: 8px;"></span>
            <span class="opacity-80 text-sm text-gray-200">{{ formatAddress(authStore.address) || 'Usuario' }}</span>
          </div>
        </div>
  <div class="flex-shrink-0 sidebar-svg-wrapper flex items-center justify-center text-white">
          <svg class="w-4 h-4 opacity-25 fill-brand-80" viewBox="0 0 20 20">
            <path d="M14 8a4 4 0 1 0-8 0v7h8V8zM8.027 2.332A6.003 6.003 0 0 0 4 8v6l-3 2v1h18v-1l-3-2V8a6.003 6.003 0 0 0-4.027-5.668 2 2 0 1 0-3.945 0zM12 18a2 2 0 1 1-4 0h4z" fill-rule="evenodd" />
          </svg>
        </div>
      </div>
      <!-- Channels -->
  <div class="mb-6 bg-brand-10 text-white">
  <div class="flex justify-between items-center px-3 pb-2 text-white">
          <div class="font-semibold text-[14px] text-white">Channels</div>
          <div class="flex-shrink-0 sidebar-svg-wrapper flex items-center justify-center">
            <svg class="w-4 h-4 opacity-50 fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
  <div class="px-3 py-1.5 rounded-lg cursor-pointer text-[14px] bg-accent text-white shadow-sm font-bold"># general</div>
      </div>
      <!-- Direct Messages -->
  <div class="mb-6 bg-brand-10 text-white">
  <div class="flex justify-between items-center px-3 pb-2 text-white">
          <div class="font-semibold text-[14px] text-white">Direct Messages</div>
          <div class="flex-shrink-0 sidebar-svg-wrapper flex items-center justify-center">
            <svg class="w-4 h-4 opacity-50 fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
        <div class="flex items-center mb-2 px-3 cursor-pointer text-[14px]">
          <span class="rounded-full block w-2 h-2 mr-2 flex-shrink-0 bg-brand"></span>
          <span class="font-semibold text-white">{{ formatAddress(authStore.address) || 'Usuario' }} <span class="opacity-80 text-[12px] text-gray-200">(tú)</span></span>
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
      <div class="text-white">
        <div class="flex justify-between items-center px-3 pb-2 text-white bg-brand-10">
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
  <div class="flex-1 flex flex-col h-screen overflow-hidden bg-bg-primary">
      <!-- Top bar -->
  <!-- Top Bar -->
  <div class="flex items-center flex-shrink-0 px-4 py-3 border-b border-brand-20 bg-brand-10">
        <div style="display: flex; flex-direction: column;">
          <h3 class="mb-1 font-extrabold text-[18px] text-color-brand">#general</h3>
          <div class="text-xs">
            <span :class="isConnected ? 'text-green-500' : 'text-red-500'">
              {{ isConnected ? 'Conectado' : 'Desconectado' }}
            </span>
          </div>
          <div class="text-sm opacity-75 text-color-textSecondary">
            Chat descentralizado con tecnología blockchain
          </div>
        </div>
        <div class="ml-auto relative">
          <input 
            type="search" 
            placeholder="Buscar..." 
            class="appearance-none border rounded-lg px-8 py-2 outline-none w-[200px] bg-bg-secondary text-color-textSecondary border-brand-20" 
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
          <div v-if="isLoading" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 border-brand-60"></div>
              <p class="text-sm text-color-textSecondary">Cargando mensajes...</p>
            </div>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="flex items-center justify-center h-full">
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
          </div>

          <!-- Welcome message -->
          <div v-else-if="messages.length === 0" class="text-center py-8">
            <div class="text-2xl mb-2">💬</div>
            <h3 class="text-base font-semibold mb-1 text-color-brand">¡Bienvenido al chat!</h3>
            <p class="text-xs opacity-75 text-color-textSecondary">No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
          
          <!-- Messages list -->
          <div v-else>
            <div 
              v-for="(msg, index) in messages" 
              :key="index" 
              class="message mb-4"
            >
              <div :class="`flex ${msg.sender === formatAddress(authStore.address) ? 'justify-end' : 'justify-start'}`">
                <div :class="`p-3 rounded-lg inline-block max-w-xs shadow-md ${msg.sender === formatAddress(authStore.address) ? 'bg-action text-color-textPrimary' : 'bg-accent text-color-textPrimary'}`">
                  <div class="flex items-center mb-1">
                    <span class="font-bold mr-2 text-sm">
                      {{ msg.sender === formatAddress(authStore.address) ? 'Tú' : msg.sender }}
                    </span>
                    <span class="text-xs opacity-75">
                      {{ formatTime(msg.timestamp) }}
                    </span>
                  </div>
                  <div class="break-words">
                    {{ msg.text }}
                  </div>
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
              class="flex-1 px-4 py-2 focus:outline-none bg-bg-secondary text-black" 
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
          <div class="text-xs mt-1">
            <span :class="isConnected ? 'text-green-500' : 'text-red-500'">
              {{ isConnected ? '● Conectado' : '● Desconectado' }}
            </span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
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

