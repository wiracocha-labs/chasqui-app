<template>
  <!-- Layout estilo Slack/Discord basado en el HTML de referencia -->
  <div class="font-sans antialiased h-screen flex" style="background: #edf2f7;">
    <!-- Primary sidebar - App selector (más estrecho) -->
    <div class="bg-indigo-darkest text-purple-lighter flex-none w-20 p-4 hidden md:block">
      <div class="cursor-pointer mb-4">
        <div class="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
          <span class="text-indigo-600 font-bold">C</span>
        </div>
        <div class="text-center text-white opacity-50 text-xs">⌘1</div>
      </div>
      <div class="cursor-pointer mb-4">
        <div class="bg-indigo-lighter opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
          T
        </div>
        <div class="text-center text-white opacity-50 text-xs">⌘2</div>
      </div>
      <div class="cursor-pointer">
        <div class="bg-white opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
          <svg class="fill-current h-6 w-6 block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Secondary sidebar - Channels and users -->
    <div class="bg-indigo-darker text-purple-lighter flex-none w-64 pb-6 hidden md:block">
      <!-- Workspace header -->
      <div class="text-white mb-2 mt-3 px-4 flex justify-between">
        <div class="flex-auto">
          <h1 class="font-semibold text-xl leading-tight mb-1 truncate">Chasqui Chat</h1>
          <div class="flex items-center mb-6">
            <span :class="`rounded-full block w-2 h-2 mr-2 ${isConnected ? 'bg-green' : 'bg-red-400'}`"></span>
            <span class="text-white opacity-50 text-sm">{{ formatAddress(authStore.address) }}</span>
          </div>
        </div>
        <div>
          <svg class="h-6 w-6 fill-current text-white opacity-25" viewBox="0 0 20 20">
            <path d="M14 8a4 4 0 1 0-8 0v7h8V8zM8.027 2.332A6.003 6.003 0 0 0 4 8v6l-3 2v1h18v-1l-3-2V8a6.003 6.003 0 0 0-4.027-5.668 2 2 0 1 0-3.945 0zM12 18a2 2 0 1 1-4 0h4z" fill-rule="evenodd" />
          </svg>
        </div>
      </div>

      <!-- Channels section -->
      <div class="mb-8">
        <div class="px-4 mb-2 text-white flex justify-between items-center">
          <div class="opacity-75">Canales</div>
          <div>
            <svg class="fill-current h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
        <div class="bg-teal-dark py-1 px-4 text-white cursor-pointer hover:bg-teal transition-colors"># general</div>
        <div class="py-1 px-4 text-white opacity-75 cursor-pointer hover:bg-teal-dark transition-colors"># tareas</div>
      </div>

      <!-- Direct Messages section -->
      <div class="mb-8">
        <div class="px-4 mb-2 text-white flex justify-between items-center">
          <div class="opacity-75">Mensajes Directos</div>
          <div>
            <svg class="fill-current h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
        
        <div class="flex items-center mb-3 px-4 cursor-pointer hover:bg-indigo-dark transition-colors py-1 rounded">
          <span :class="`rounded-full block w-2 h-2 mr-2 ${isConnected ? 'bg-green' : 'bg-red-400'}`"></span>
          <span class="text-white opacity-75">{{ formatAddress(authStore.address) }} <span class="text-grey text-sm">(tú)</span></span>
        </div>
        
        <div 
          v-for="user in onlineUsers" 
          :key="user.id"
          class="flex items-center mb-3 px-4 cursor-pointer hover:bg-indigo-dark transition-colors py-1 rounded"
        >
          <span class="bg-green rounded-full block w-2 h-2 mr-2"></span>
          <span class="text-white opacity-75">{{ user.name }}</span>
        </div>
        
        <div class="flex items-center px-4 mb-6 opacity-50 cursor-pointer hover:opacity-75 transition-opacity py-1 rounded">
          <span class="border border-white rounded-full w-2 h-2 mr-2"></span>
          <span class="text-white">Usuario Offline</span>
        </div>
      </div>

      <!-- Apps section -->
      <div>
        <div class="px-4 mb-2 text-white flex justify-between items-center">
          <div class="opacity-75">Apps</div>
          <div>
            <svg class="fill-current h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat content -->
    <div class="flex-1 flex flex-col bg-white overflow-hidden">
      <!-- Top bar -->
      <div class="border-b flex px-6 py-2 items-center flex-none">
        <div class="flex flex-col">
          <h3 class="text-grey-darkest mb-1 font-extrabold"># general</h3>
          <div class="text-grey-dark text-sm truncate">
            Chat descentralizado con GunDB - Chit-chattin' about decentralized messaging.
          </div>
        </div>
        <div class="ml-auto hidden md:block">
          <div class="relative">
            <input 
              type="search" 
              placeholder="Search" 
              class="appearance-none border border-grey rounded-lg pl-8 pr-4 py-2"
            >
            <div class="absolute pin-y pin-l pl-3 flex items-center justify-center">
              <svg class="fill-current text-grey h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages area -->
      <div class="px-4 py-4 flex-1 overflow-y-scroll" style="height: calc(100vh - 200px);" ref="messagesContainer">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p class="text-gray-600 text-sm">Cargando mensajes...</p>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="flex items-center justify-center h-full">
          <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center max-w-md mx-4">
            <i class="fas fa-exclamation-triangle text-xl mb-2"></i>
            <div class="font-semibold mb-2">¡Error de conexión!</div>
            <div class="text-sm mb-4">{{ error }}</div>
            <button 
              @click="loadMessages"
              class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
            >
              <i class="fas fa-redo mr-2"></i> Reintentar
            </button>
          </div>
        </div>

        <!-- Welcome message -->
        <div v-else-if="messages.length === 0" class="text-center py-8">
          <div class="text-2xl mb-2">💬</div>
          <h3 class="text-base font-semibold text-gray-700 mb-1">¡Bienvenido al chat!</h3>
          <p class="text-gray-500 text-xs">No hay mensajes aún. ¡Sé el primero en escribir!</p>
        </div>
        
        <!-- Messages list con estilo similar al HTML original -->
        <div v-else class="space-y-4">
          <div 
            v-for="(msg, index) in messages" 
            :key="index" 
            class="message mb-4 transition-all duration-300"
          >
            <div class="flex items-start">
              <!-- Avatar -->
              <div class="flex-shrink-0 mr-3">
                <div class="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span class="text-white text-xs font-medium">
                    {{ getInitials(msg.sender) }}
                  </span>
                </div>
              </div>
              
              <!-- Message content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center mb-1">
                  <span class="font-bold mr-2 text-gray-900 text-sm">
                    {{ msg.sender === formatAddress(authStore.address) ? 'Tú' : msg.sender }}
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ formatTime(msg.timestamp) }}
                  </span>
                </div>
                <div class="text-gray-800 text-sm leading-relaxed break-words">
                  {{ msg.text }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message input area con estilo del HTML original -->
      <div class="pb-6 px-4 flex-none">
        <form @submit.prevent="sendMessage" class="flex rounded-lg border-2 border-grey overflow-hidden">
          <input 
            v-model="inputMessage"
            type="text" 
            class="flex-1 px-4 py-2 focus:outline-none" 
            placeholder="Escribe un mensaje..." 
            autocomplete="off"
            :disabled="!isConnected"
          >
          <button 
            type="submit"
            :disabled="!inputMessage.trim() || !isConnected"
            class="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </form>
        <div class="text-xs text-gray-500 mt-1">
          <span :class="isConnected ? 'text-green-600' : 'text-red-600'">
            {{ isConnected ? 'Conectado' : 'Desconectado' }}
          </span>
          <span class="ml-4 text-gray-400">Presiona Enter para enviar</span>
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

const getInitials = (name: string) => {
  return name.slice(0, 2).toUpperCase()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Initialize GunDB
const initializeGun = () => {
  try {
    // Load GunDB from CDN
    if (typeof window !== 'undefined' && (window as any).Gun) {
      gun = (window as any).Gun({
        peers: ['https://gun-manhattan.herokuapp.com/gun'],
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
      throw new Error('GunDB not loaded')
    }
  } catch (err) {
    console.error('Error initializing GunDB:', err)
    error.value = 'Error al conectar con la red descentralizada'
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

// Load GunDB script dynamically
const loadGunScript = () => {
  return new Promise((resolve, reject) => {
    if ((window as any).Gun) {
      resolve(true)
      return
    }

    const scripts = [
      'https://unpkg.com/gun/gun.js',
      'https://unpkg.com/gun/sea.js',
      'https://unpkg.com/gun/lib/radix.js',
      'https://unpkg.com/gun/lib/radisk.js',
      'https://unpkg.com/gun/lib/store.js',
      'https://unpkg.com/gun/lib/rindexed.js'
    ]

    let loadedCount = 0

    scripts.forEach(src => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        loadedCount++
        if (loadedCount === scripts.length) {
          // Small delay to ensure all scripts are properly initialized
          setTimeout(() => resolve(true), 500)
        }
      }
      script.onerror = () => reject(new Error(`Failed to load ${src}`))
      document.head.appendChild(script)
    })
  })
}

// Lifecycle
onMounted(async () => {
  try {
    await loadGunScript()
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

<style scoped>
/* Animaciones específicas para mensajes */
.message {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects para canales y usuarios */
.hover\:bg-indigo-dark:hover {
  background-color: #5A67D8;
}

.hover\:bg-teal:hover {
  background-color: #38B2AC;
}

.hover\:bg-teal-dark:hover {
  background-color: #2D7D7D;
}

/* Scrollbar personalizado */
.overflow-y-scroll::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .message-container {
    height: calc(100vh - 160px);
  }
}
</style>
