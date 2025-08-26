<template>
  <div class="main-container" style="display: flex; flex-direction: row; height: 100vh; overflow: hidden; background: var(--color-bg-secondary);">
    
    <!-- Left Sidebar - Workspace Icons -->
    <div class="left-sidebar" style="width: 80px; min-width: 80px; background-color: var(--color-bg-primary); padding: 8px; display: flex; flex-direction: column; border-right: 1px solid rgba(212, 175, 55, 0.2);">
      <div class="cursor-pointer mb-3">
        <div class="icon-container text-lg font-semibold rounded-lg mb-1 overflow-hidden" style="background-color: var(--color-brand); color: var(--color-text-secondary); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          C
        </div>
        <div class="text-center opacity-50 text-xs" style="color: var(--color-text-primary);">⌘1</div>
      </div>
      <div class="cursor-pointer mb-3">
        <div class="icon-container opacity-25 text-lg font-semibold rounded-lg mb-1 overflow-hidden" style="background-color: var(--color-bg-secondary); color: var(--color-text-secondary); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          L
        </div>
        <div class="text-center opacity-50 text-xs" style="color: var(--color-text-primary);">⌘2</div>
      </div>
      <div class="cursor-pointer">
        <div class="icon-container opacity-25 rounded-lg mb-1 overflow-hidden" style="background-color: var(--color-bg-secondary); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <svg style="width: 16px; height: 16px; fill: var(--color-text-secondary);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Middle Sidebar - Channels and DMs -->
    <div class="middle-sidebar" style="width: 260px; min-width: 260px; background-color: #4A4D63; color: var(--color-text-primary); padding: 16px 12px; display: flex; flex-direction: column; border-right: 1px solid rgba(212, 175, 55, 0.2);">
      <div class="mb-4 flex justify-between" style="color: var(--color-text-primary);">
        <div class="flex-auto">
          <h1 class="font-semibold text-lg leading-tight mb-1 truncate">Chasqui Chat</h1>
          <div class="flex items-center mb-4">
            <span class="rounded-full block mr-2 flex-shrink-0" style="width: 8px; height: 8px; background-color: var(--color-brand);"></span>
            <span class="opacity-50 text-sm">{{ formatAddress(authStore.address) || 'Usuario' }}</span>
          </div>
        </div>
        <div class="flex-shrink-0">
          <svg style="width: 20px; height: 20px; opacity: 0.25; fill: var(--color-text-primary);" viewBox="0 0 20 20">
            <path d="M14 8a4 4 0 1 0-8 0v7h8V8zM8.027 2.332A6.003 6.003 0 0 0 4 8v6l-3 2v1h18v-1l-3-2V8a6.003 6.003 0 0 0-4.027-5.668 2 2 0 1 0-3.945 0zM12 18a2 2 0 1 1-4 0h4z" fill-rule="evenodd" />
          </svg>
        </div>
      </div>
      <div class="mb-6">
        <div style="padding: 0 12px 8px 12px; display: flex; justify-content: space-between; align-items: center; color: var(--color-text-primary);">
          <div style="opacity: 0.75; font-size: 14px;">Channels</div>
          <div style="flex-shrink: 0;">
            <svg style="width: 16px; height: 16px; opacity: 0.5; fill: var(--color-text-primary);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
        <div style="padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; background-color: var(--color-brand); color: var(--color-text-secondary);"># general</div>
      </div>
      <div class="mb-6">
        <div style="padding: 0 12px 8px 12px; display: flex; justify-content: space-between; align-items: center; color: var(--color-text-primary);">
          <div style="opacity: 0.75; font-size: 14px;">Direct Messages</div>
          <div style="flex-shrink: 0;">
            <svg style="width: 16px; height: 16px; opacity: 0.5; fill: var(--color-text-primary);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 0 12px; cursor: pointer; font-size: 14px;">
          <span style="border-radius: 50%; display: block; width: 8px; height: 8px; margin-right: 8px; flex-shrink: 0; background-color: var(--color-brand);"></span>
          <span style="opacity: 0.75;">{{ formatAddress(authStore.address) || 'Usuario' }} <span style="opacity: 0.5; font-size: 12px;">(tú)</span></span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 0 12px; cursor: pointer; font-size: 14px;">
          <span style="border-radius: 50%; display: block; width: 8px; height: 8px; margin-right: 8px; flex-shrink: 0; background-color: var(--color-brand);"></span>
          <span style="opacity: 0.75;">David Hemphill</span>
        </div>
        <div style="display: flex; align-items: center; padding: 0 12px; margin-bottom: 16px; opacity: 0.5; cursor: pointer; font-size: 14px;">
          <span style="border: 1px solid var(--color-text-primary); border-radius: 50%; display: block; width: 8px; height: 8px; margin-right: 8px; flex-shrink: 0;"></span>
          <span>Steve Schoger</span>
        </div>
      </div>
      <div>
        <div style="padding: 0 12px 8px 12px; display: flex; justify-content: space-between; align-items: center; color: var(--color-text-primary);">
          <div style="opacity: 0.75; font-size: 14px;">Apps</div>
          <div style="flex-shrink: 0;">
            <svg style="width: 16px; height: 16px; opacity: 0.5; fill: var(--color-text-primary);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Chat content -->
    <div style="flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; background-color: var(--color-bg-secondary);">
      <!-- Top bar -->
      <div style="border-bottom: 1px solid var(--border-light); display: flex; padding: 12px 16px; align-items: center; flex-shrink: 0; background-color: var(--color-bg-secondary);">
        <div style="display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 4px; font-weight: 800; font-size: 18px; color: var(--color-text-secondary);">#general</h3>
          <div style="font-size: 12px;">
            <span :class="isConnected ? 'text-green-500' : 'text-red-500'">
              {{ isConnected ? 'Conectado' : 'Desconectado' }}
            </span>
          </div>
          <div style="font-size: 14px; opacity: 0.75; color: var(--color-text-secondary);">
            Chat descentralizado con tecnología blockchain
          </div>
        </div>
        <div style="margin-left: auto;">
          <div style="position: relative;">
            <input 
              type="search" 
              placeholder="Buscar..." 
              style="appearance: none; border: 1px solid var(--border-medium); border-radius: 8px; padding: 8px 8px 8px 32px; outline: none; width: 200px; background-color: var(--color-bg-secondary); color: var(--color-text-secondary);"
            >
            <div style="position: absolute; top: 0; bottom: 0; left: 0; padding-left: 12px; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 16px; height: 16px; fill: var(--color-text-secondary);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
        
        <!-- Chat messages -->
        <div class="px-4 py-4 flex-1 overflow-y-scroll message-container" ref="messagesContainer">
          <!-- Loading state -->
          <div v-if="isLoading" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style="border-color: var(--color-brand);"></div>
              <p class="text-sm" style="color: var(--color-text-secondary);">Cargando mensajes...</p>
            </div>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="flex items-center justify-center h-full">
            <div class="border px-6 py-4 rounded-lg text-center max-w-md mx-4" style="background-color: var(--color-action-10); border-color: var(--color-action); color: var(--color-action);">
              <div class="font-semibold mb-2">¡Error de conexión!</div>
              <div class="text-sm mb-4">{{ error }}</div>
              <button 
                @click="loadMessages"
                class="font-medium py-2 px-4 rounded text-sm transition-colors hover:opacity-80"
                style="background-color: var(--color-action); color: var(--color-text-primary);"
              >
                Reintentar
              </button>
            </div>
          </div>

          <!-- Welcome message -->
          <div v-else-if="messages.length === 0" class="text-center py-8">
            <div class="text-2xl mb-2">💬</div>
            <h3 class="text-base font-semibold mb-1" style="color: var(--color-text-secondary);">¡Bienvenido al chat!</h3>
            <p class="text-xs opacity-75" style="color: var(--color-text-secondary);">No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
          
          <!-- Messages list -->
          <div v-else>
            <div 
              v-for="(msg, index) in messages" 
              :key="index" 
              class="message mb-4"
            >
              <div :class="`flex ${msg.sender === formatAddress(authStore.address) ? 'justify-end' : 'justify-start'}`">
                <div :class="`p-3 rounded-lg inline-block max-w-xs ${msg.sender === formatAddress(authStore.address) ? '' : ''}`" :style="`background-color: ${msg.sender === formatAddress(authStore.address) ? 'var(--color-brand)' : 'var(--color-bg-primary)'}; color: ${msg.sender === formatAddress(authStore.address) ? 'var(--color-text-secondary)' : 'var(--color-text-primary)'};`">
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
          <form @submit.prevent="sendMessage" class="flex rounded-lg border-2 overflow-hidden" style="border-color: var(--border-medium);">
            <input 
              v-model="inputMessage"
              type="text" 
              class="flex-1 px-4 py-2 focus:outline-none" 
              placeholder="Escribe un mensaje..." 
              autocomplete="off"
              :disabled="!isConnected"
              style="background-color: var(--color-bg-secondary); color: var(--color-text-secondary);"
            >
            <button 
              type="submit"
              :disabled="!inputMessage.trim() || !isConnected"
              class="px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
              style="background-color: var(--color-brand); color: var(--color-text-secondary);"
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
.message-container {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.message {
  transition: all 0.3s ease;
}

/* Forzar tamaños específicos para los iconos */
svg {
  max-width: 24px !important;
  max-height: 24px !important;
  width: 24px !important;
  height: 24px !important;
  flex-shrink: 0;
}

/* Tamaños específicos para diferentes contextos */
.sidebar-icon svg {
  width: 16px !important;
  height: 16px !important;
  max-width: 16px !important;
  max-height: 16px !important;
}

.notification-icon svg {
  width: 20px !important;
  height: 20px !important;
  max-width: 20px !important;
  max-height: 20px !important;
}

/* Contenedores de iconos circulares */
.icon-container {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
  max-width: 40px !important;
  max-height: 40px !important;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sidebar contenedor */
.left-sidebar {
  width: 80px !important;
  min-width: 80px !important;
  max-width: 80px !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  height: 100vh !important;
  display: flex !important;
  flex-direction: column !important;
  background-color: var(--color-bg-primary) !important;
  border-right: 1px solid var(--border-light) !important;
}

.middle-sidebar {
  width: 260px !important;
  min-width: 260px !important;
  max-width: 260px !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  height: 100vh !important;
  display: flex !important;
  flex-direction: column !important;
  background-color: #4A4D63 !important;
  border-right: 1px solid var(--border-light) !important;
}

/* Forzar layout horizontal */
.main-container {
  display: flex !important;
  flex-direction: row !important;
  height: 100vh !important;
  overflow: hidden !important;
  position: relative !important;
  width: 100vw !important;
  max-width: 100vw !important;
}

/* Debug - Asegurar visibilidad */
.left-sidebar, .middle-sidebar {
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  z-index: 2 !important;
}

/* Asegurar que el chat area esté correctamente posicionado */
.chat-area {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
  overflow: hidden !important;
}

/* Header del chat solo en su área */
.chat-header {
  flex-shrink: 0 !important;
  border-bottom: 1px solid var(--border-light) !important;
  background-color: var(--color-bg-secondary) !important;
  z-index: 1 !important;
}
</style>
