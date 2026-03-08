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
          <div 
            class="flex-shrink-0 sidebar-svg-wrapper flex items-center justify-center cursor-pointer transition-colors group"
            @click="showCreateModal = true"
            title="Crear conversación"
          >
            <svg class="w-4 h-4 fill-secondary group-hover:fill-brand transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
          <div 
            v-for="group in userGroups" 
            :key="getConversationId(group)"
            @click="selectConversation(group)"
            :class="[
              'px-3 py-1.5 rounded-lg cursor-pointer text-[14px] flex items-center gap-2',
              (currentConversation && getConversationId(currentConversation) === getConversationId(group)) 
                ? 'bg-accent text-white shadow-sm font-bold' 
                : 'text-white/70 hover:bg-brand-10'
            ]"
          >
            <span :class="[(currentConversation && getConversationId(currentConversation) === getConversationId(group)) ? 'opacity-50' : 'opacity-30']">#</span> 
            {{ group.name || 'Grupo sin nombre' }}
          </div>
          
          <div v-if="userGroups.length === 0 && !isLoading" class="px-3 py-2 text-xs text-white/40 italic">
            No tienes grupos aún
          </div>
      </div>
      <!-- Direct Messages -->
  <div class="mb-6 bg-brand-10 text-white rounded-xl">
        <div class="flex justify-between items-center px-3 pb-2 text-white">
          <div class="font-semibold text-[14px] text-white">Mensajes directos</div>
          <div 
            class="flex-shrink-0 sidebar-svg-wrapper flex items-center justify-center cursor-pointer transition-colors group"
            @click="openModal('direct')"
            title="Nuevo mensaje directo"
          >
            <svg class="w-4 h-4 fill-secondary group-hover:fill-brand transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
          </div>
        </div>
        <div 
          v-for="direct in userDirects" 
          :key="getConversationId(direct)"
          @click="selectConversation(direct)"
          :class="[
            'flex items-center mb-2 px-3 cursor-pointer text-[14px]',
            (currentConversation && getConversationId(currentConversation) === getConversationId(direct)) 
              ? 'font-bold' 
              : 'opacity-80'
          ]"
        >
          <span :class="[
            'rounded-full block w-2 h-2 mr-2 flex-shrink-0',
            (currentConversation && getConversationId(currentConversation) === getConversationId(direct)) ? 'bg-brand' : 'border border-brand'
          ]"></span>
          <span class="text-white">{{ getDirectConversationName(direct) }}</span>
        </div>
        
        <div v-if="userDirects.length === 0 && !isLoading" class="px-3 py-2 text-xs text-white/40 italic">
          No tienes mensajes directos aún
        </div>
      </div>
      <!-- Apps -->
      <div class="text-white rounded-xl">
        <div class="flex justify-between items-center px-3 pb-2 text-white bg-brand-10 rounded-xl">
          <div class="font-semibold text-[14px] text-white">Apps</div>
          <div class="flex-shrink-0 sidebar-svg-wrapper flex items-center justify-center cursor-pointer transition-colors group">
            <svg class="w-4 h-4 fill-secondary group-hover:fill-brand transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
          <h3 class="mb-1 font-extrabold text-[18px] text-color-brand">
            <span v-if="currentConversation">
              {{ currentConversation.conversation_type === 'group' ? '#' : '@' }} 
              {{ currentConversation.conversation_type === 'group' ? (currentConversation.name || 'Grupo') : getDirectConversationName(currentConversation) }}
            </span>
            <span v-else>Selecciona un chat</span>
          </h3>
          <div class="text-xs" v-if="currentConversation">
            <span :class="isConnected ? 'text-green-500' : 'text-red-500'">
              {{ isConnected ? 'API Conectada' : 'API Desconectada' }}
            </span>
          </div>
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
          
          <!-- Messages list (Dynamic) -->
          <div class="space-y-6">
            
            <div v-if="!currentConversation" class="h-full flex flex-col items-center justify-center mt-20 opacity-50">
              <div class="text-4xl mb-4">💬</div>
              <h3 class="text-xl font-bold text-white">Chasqui Messenger</h3>
              <p class="text-white/70">Selecciona un chat en la barra lateral para comenzar</p>
            </div>

            <div v-else-if="messages.length === 0" class="text-center py-8 opacity-50">
              <div class="text-2xl mb-2">👋</div>
              <h3 class="text-base font-semibold mb-1 text-color-brand">No hay mensajes aún</h3>
              <p class="text-xs text-color-textSecondary">¡Sé el primero en escribir!</p>
            </div>

            <div v-else v-for="(message, index) in messages" :key="index" class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-700 flex-shrink-0 border-2 border-brand-20 overflow-hidden flex items-center justify-center">
                 <div class="text-xl">👤</div>
              </div>
              <div class="flex-1">
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="font-bold text-white text-[15px]">{{ message.sender }}</span>
                  <span class="text-[12px] opacity-40">{{ formatTime(message.timestamp) }}</span>
                </div>
                <div class="text-[15px] leading-relaxed text-gray-200">
                  {{ message.text }}
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
    <!-- Create Conversation Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-terciary w-[400px] rounded-2xl border border-brand-20 p-6 shadow-2xl">
        <h2 class="text-xl font-bold text-white mb-4">
          {{ modalType === 'group' ? 'Nueva Conversación' : 'Nuevo Mensaje Directo' }}
        </h2>
        
        <div class="space-y-4">
          <div v-if="modalType === 'group'">
            <label class="block text-xs font-semibold text-color-textSecondary mb-1 uppercase">Nombre del grupo</label>
            <input 
              v-model="newGroupName" 
              type="text" 
              placeholder="Ej: Tarea #14" 
              class="w-full bg-secondary border border-brand-20 rounded-lg px-4 py-2 text-white outline-none focus:border-brand transition-colors"
            >
          </div>
          
          <div>
            <label class="block text-xs font-semibold text-color-textSecondary mb-1 uppercase">
              {{ modalType === 'group' ? 'Participantes (Billeteras)' : 'Billetera del destinatario' }}
            </label>
            <textarea 
              v-model="newGroupParticipants" 
              :placeholder="modalType === 'group' ? '0x..., 0x...' : '0x...'" 
              :rows="modalType === 'group' ? 3 : 1"
              class="w-full bg-secondary border border-brand-20 rounded-lg px-4 py-2 text-white outline-none focus:border-brand transition-colors resize-none"
            ></textarea>
            <p v-if="modalType === 'group'" class="text-[10px] text-color-textSecondary mt-1 italic">Separa las direcciones por comas.</p>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            @click="showCreateModal = false"
            class="flex-1 px-4 py-2 rounded-lg border border-brand-20 text-white hover:bg-brand-10 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="createConversation"
            :disabled="modalType === 'group' ? !newGroupName : !newGroupParticipants"
            class="flex-1 px-4 py-2 rounded-lg bg-brand text-white font-bold hover:bg-brand-60 transition-colors disabled:opacity-50"
          >
            {{ modalType === 'group' ? 'Crear' : 'Empezar' }}
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '../components/ui/AppSidebar.vue'
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import { apiGet } from '../services/api'
import { log } from '../services/logger'

// Types
type SurrealId = string | { tb: string, id: { String: string } }

type Conversation = {
  id?: SurrealId
  participants: SurrealId[]
  conversation_type: 'direct' | 'group'
  name?: string
  created_at: string
  updated_at: string
}

type Message = {
  text: string
  sender: string
  timestamp: number
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

const userGroups = ref<Conversation[]>([])
const userDirects = ref<Conversation[]>([])
const currentConversation = ref<Conversation | null>(null)

// NEW: Create Conversation Modal
const showCreateModal = ref(false)
const modalType = ref<'group' | 'direct'>('group')
const newGroupName = ref('')
const newGroupParticipants = ref('') // Wallet addresses comma separated

const openModal = (type: 'group' | 'direct') => {
  modalType.value = type
  showCreateModal.value = true
}

// Utility functions
const getStrId = (id: SurrealId | undefined): string => {
  if (!id) return ''
  if (typeof id === 'string') return id
  return `${id.tb}:${id.id.String}`
}

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

const getConversationId = (conv: Conversation): string => {
  return getStrId(conv.id)
}

const getDirectConversationName = (conv: Conversation): string => {
  if (conv.name) return conv.name
  // Find the other participant
  const otherParticipant = conv.participants.find(p => {
    const pId = getStrId(p)
    // Check both 'user:address' and 'address'
    const addressOnly = pId.includes(':') ? pId.split(':')[1] : pId
    return addressOnly.toLowerCase() !== authStore.address?.toLowerCase()
  })
  
  if (otherParticipant) {
    const pId = getStrId(otherParticipant)
    return formatAddress(pId.includes(':') ? pId.split(':')[1] : pId)
  }
  return 'Direct Chat'
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Load existing conversations
const loadConversations = async () => {
  if (!authStore.isAuthenticated) {
    error.value = 'No has iniciado sesión.'
    isLoading.value = false
    return
  }

  try {
    error.value = null
    isLoading.value = true
    
    log.info('ChatView', 'Fetching conversations from API...')
    const convs = await apiGet<Conversation[]>('/conversations', authStore.token)
    log.info('ChatView', `Received ${convs.length} conversations`, convs)
    
    // Split into Groups and Directs
    userGroups.value = convs.filter(c => c.conversation_type === 'group')
    userDirects.value = convs.filter(c => c.conversation_type === 'direct')
    
    isConnected.value = true
  } catch (err) {
    log.error('ChatView', 'Error loading conversations:', err)
    error.value = 'No se pudieron cargar las conversaciones'
    isConnected.value = false
  } finally {
    isLoading.value = false
  }
}

// NEW: Create a conversation (group or direct)
const createConversation = async () => {
  // For group, name is required. For direct, participants is required.
  if (modalType.value === 'group' && !newGroupName.value.trim()) return
  if (!newGroupParticipants.value.trim()) return

  try {
    const parts = newGroupParticipants.value
      .split(',')
      .map(p => p.trim())
      .filter(p => p !== '')
    
    // Ensure current user is in participants if needed
    if (!parts.includes(authStore.address || '')) {
      if (authStore.address) parts.push(authStore.address)
    }

    const payload: any = {
      participant_ids: parts,
      conversation_type: modalType.value
    }

    if (modalType.value === 'group') {
      payload.name = newGroupName.value.trim()
    }

    const newConv = await import('../services/api').then(m => 
      m.apiPost<Conversation>('/conversations', payload, authStore.token)
    )

    log.info('ChatView', 'Conversation created successfully', newConv)
    
    showCreateModal.value = false
    newGroupName.value = ''
    newGroupParticipants.value = ''
    
    await loadConversations()
  } catch (err) {
    log.error('ChatView', 'Error creating conversation', err)
    alert('Error al crear la conversación')
  }
}

// Send message
const sendMessage = async () => {
  if (!inputMessage.value.trim() || !isConnected.value || !currentConversation.value) {
    return
  }
  
  const text = inputMessage.value.trim()
  inputMessage.value = ''

  try {
    const urlId = getStrId(currentConversation.value.id)
    if (!urlId) return

    // Add to UI immediately
    messages.value.push({
      text,
      sender: formatAddress(authStore.address),
      timestamp: Date.now()
    })
    setTimeout(scrollToBottom, 50)

    // Send to backend via REST API
    const payload = {
      content: text,
      message_type: 'text'
    }
    
    // apiPost internally uses apiFetch with JSON.stringify
    import('../services/api').then(({ apiPost }) => {
      apiPost(`/conversations/${urlId}/messages`, payload, authStore.token).catch(err => {
        log.error('ChatView', 'Error sending message via API', err)
      })
    })

  } catch (err) {
    log.error('ChatView', 'Error sending message', err)
  }
}

// Select a conversation
const selectConversation = async (conv: Conversation) => {
  currentConversation.value = conv
  messages.value = [] // Clear messages for now
  
  if (!authStore.isAuthenticated) return
  
  try {
    const urlId = getConversationId(conv)
    if (!urlId) return

    const msgs = await apiGet<any[]>(`/conversations/${urlId}/messages`, authStore.token)
    
    // Map backend messages to UI structure
    messages.value = msgs.map(m => ({
      text: m.content || '',
      sender: formatAddress(getStrId(m.sender_id)),
      timestamp: new Date(m.created_at || Date.now()).getTime()
    })).sort((a, b) => a.timestamp - b.timestamp)
    
    setTimeout(scrollToBottom, 50)
  } catch (err) {
    log.error('ChatView', 'Error fetching messages', err)
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await loadConversations()
    
    // Focus on input when component mounts
    nextTick(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
      if (inputElement) {
        inputElement.focus()
      }
    })
    
  } catch (err) {
    log.error('ChatView', 'Error setting up chat:', err)
    error.value = 'Error al inicializar el chat'
    isLoading.value = false
  }
})
</script>
