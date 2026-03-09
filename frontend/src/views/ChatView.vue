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
    
    <!-- Chat Content Area -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden bg-bg-primary">
      <div v-if="currentConversation" class="border-b border-white border-opacity-10 p-4 flex justify-between items-center bg-white bg-opacity-5">
        <div>
          <h2 class="text-xl font-bold flex items-center gap-2">
            {{ currentConversation.conversation_type === 'group' ? '#' : '' }}
            {{ currentConversation.name || getDirectConversationName(currentConversation) }}
          </h2>
          <div class="flex gap-3 text-xs mt-1">
            <span :class="isConnected ? 'text-green-500' : 'text-red-500'" class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full" :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></span> API
            </span>
            <span :class="isSocketConnected ? 'text-green-500' : 'text-red-500'" class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full" :class="isSocketConnected ? 'bg-green-500' : 'bg-red-500'"></span> Real-time
            </span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="showInviteModal = true"
            class="px-3 py-1.5 rounded-lg bg-secondary bg-opacity-20 text-brand hover:bg-opacity-30 transition-all text-sm font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Invitar
          </button>
          <div class="p-2 hover:bg-white hover:bg-opacity-5 rounded-full cursor-pointer transition-colors">
            <svg class="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
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
    <!-- Create Conversation Modal (Existing) -->
    <!-- Invite Guest Modal (New) -->
    <div v-if="showInviteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div class="bg-primary-light border border-white border-opacity-10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 class="text-xl font-bold mb-4">Invitar colaborador</h3>
        <p class="text-sm opacity-70 mb-6">Agrega a alguien a esta conversación usando su correo electrónico.</p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium opacity-60 mb-1">Correo electrónico</label>
            <input 
              v-model="inviteEmail"
              type="email" 
              placeholder="ejemplo@correo.com"
              class="w-full bg-black bg-opacity-20 border border-white border-opacity-10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
              @keyup.enter="handleInviteGuest"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button 
            @click="showInviteModal = false"
            class="px-6 py-2 rounded-xl hover:bg-white hover:bg-opacity-5 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button 
            @click="handleInviteGuest"
            :disabled="!inviteEmail"
            class="px-6 py-2 rounded-xl bg-brand text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            Invitar
          </button>
        </div>
      </div>
    </div>
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
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { apiGet } from '../services/api'
import { log } from '../services/logger'
import { useChatSocket } from '../composables/useChatSocket'

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

// Auth & Router
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// Reactive data
const messages = ref<Message[]>([])
const inputMessage = ref('')
const messagesContainer = ref<HTMLDivElement>()

const userGroups = ref<Conversation[]>([])
const userDirects = ref<Conversation[]>([])
const currentConversation = ref<Conversation | null>(null)

const isLoading = ref(true)
const error = ref<string | null>(null)
const isConnected = ref(false)
const showCreateModal = ref(false)
const modalType = ref<'group' | 'direct'>('group')
const showInviteModal = ref(false)
const inviteEmail = ref('')
const newGroupName = ref('')
const newGroupParticipants = ref('') // Wallet addresses comma separated

const openModal = (type: 'group' | 'direct') => {
  modalType.value = type
  showCreateModal.value = true
}

// Socket Integration
const { 
  isConnected: isSocketConnected, 
  connect: connectSocket, 
  joinConversation, 
  sendMessage: sendWsMessage,
  onEvent 
} = useChatSocket()

// Utility functions
const getStrId = (id: SurrealId | undefined): string => {
  if (!id) return ''
  if (typeof id === 'string') return id
  return `${id.tb}:${id.id.String}`
}

const formatAddress = (address: string | null) => {
  if (!address) return 'Yo'
  // If it contains @, it's an email
  if (address.includes('@')) return address
  
  if (address.length > 20 && !address.startsWith('0x')) {
    // Looks like a UUID
    return `user:${address.slice(0, 4)}...${address.slice(-4)}`
  }
  if (address.startsWith('0x')) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  return address
}

// Strictly for matching with WS msg.sender_id
const currentMatchId = computed(() => {
  if (!authStore.token) return authStore.address
  try {
    const base64Url = authStore.token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))
    // Prefer the internal UUID for matching
    return payload.id || payload.sub || authStore.address
  } catch (e) {
    return authStore.address
  }
})

// For display and fallback matching
const currentUserEmail = computed(() => {
  if (!authStore.token) return authStore.address
  try {
    const base64Url = authStore.token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))
    return payload.email || payload.username || authStore.address
  } catch (e) {
    return authStore.address
  }
})

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getConversationId = (conv: Conversation): string => {
  const fullId = getStrId(conv.id)
  const shortId = fullId.includes(':') ? fullId.split(':')[1] : fullId
  log.debug('ChatView', `🔍 mapping ${fullId} -> ${shortId}`)
  return shortId
}

// Convert conversation:uuid to backend-expected format
// Reverting to fullId because backend seems to reject 'conv:' prefix in practice
const getBackendId = (fullId: string): string => {
  return fullId
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
    log.info('ChatView', 'User not authenticated, skipping load.')
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

    // After loading, try to select from URL if not already selected
    if (!currentConversation.value && route.params.id) {
      await trySelectFromUrl(route.params.id as string)
    }
  } catch (err) {
    log.error('ChatView', 'Error loading conversations:', err)
    error.value = 'No se pudieron cargar las conversaciones'
    isConnected.value = false
  } finally {
    isLoading.value = false
  }
}

const trySelectFromUrl = async (id: string) => {
  const idToFind = id.toLowerCase()
  log.info('ChatView', `Trying to auto-select conversation from URL ID: ${idToFind}`)
  const allConvs = [...userGroups.value, ...userDirects.value]
  
  log.debug('ChatView', `Iterating over ${allConvs.length} available conversations to find ID`)
  
  // Find conversation matching the UUID part of the ID
  const found = allConvs.find(c => {
    const convShortId = getConversationId(c).toLowerCase()
    log.debug('ChatView', `Comparing URL:${idToFind} with Conv:${convShortId}`)
    return convShortId === idToFind
  })
  
  if (found) {
    log.info('ChatView', `Found matching conversation: ${idToFind}`, found)
    await selectConversation(found)
  } else {
    log.warn('ChatView', `No conversation found for URL ID: ${idToFind} among ${allConvs.length} conversations. Available IDs: ${allConvs.map(getConversationId).join(', ')}`)
  }
} 

// Double-check if we need to select something on render
watch(() => [userGroups.value, userDirects.value], () => {
  if (!currentConversation.value && route.params.id) {
    log.info('ChatView', 'Conversations updated, re-evaluating URL selection...')
    trySelectFromUrl(route.params.id as string)
  }
}, { deep: true })

// Watch for auth changes (e.g. login/wallet connect)
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth && userGroups.value.length === 0 && userDirects.value.length === 0) {
    log.info('ChatView', 'Auth detected, loading conversations...')
    loadConversations()
  }
})

// Fix room joining race condition: 
// Re-join whenever the socket connects OR the current conversation changes
watch([isSocketConnected, currentConversation], ([connected, conv]) => {
  if (connected && conv) {
    const fullId = getStrId(conv.id)
    const backendId = getBackendId(fullId)
    log.info('ChatView', `🔄 Auto-joining room: ${backendId} (Socket=${connected})`)
    joinConversation(backendId)
  }
}, { immediate: true })


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

// Invite Guest
const handleInviteGuest = async () => {
  if (!inviteEmail.value || !currentConversation.value) return
  
  try {
    const fullId = getStrId(currentConversation.value.id)
    const payload = { email: inviteEmail.value }
    
    log.info('ChatView', `Inviting guest ${inviteEmail.value} to ${fullId}`)
    
    const { apiPost } = await import('../services/api')
    await apiPost(`/conversations/${fullId}/add-guest`, payload, authStore.token)
    
    log.info('ChatView', 'Guest invited successfully')
    showInviteModal.value = false
    inviteEmail.value = ''
    alert('Invitado agregado correctamente')
    
    await loadConversations()
  } catch (err) {
    log.error('ChatView', 'Error inviting guest', err)
    alert('Error al invitar al usuario. Asegúrate de que el usuario exista en el sistema.')
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

    // 1. Add to UI immediately (Optimistic Update)
    log.info('ChatView', 'Adding message to UI locally...')
    messages.value.push({
      text,
      sender: formatAddress(currentUserEmail.value),
      timestamp: Date.now()
    })
    setTimeout(scrollToBottom, 50)

    // 2. Send to backend via REST API (for persistence)
    const payload = {
      content: text,
      message_type: 'text'
    }
    
    log.info('ChatView', '📡 Sending message via REST API...')
    // 2. Send to backend via WebSocket (as per backend-api.md)
    if (isSocketConnected.value) {
      const fullId = getStrId(currentConversation.value.id)
      const backendId = getBackendId(fullId)
      log.info('ChatView', `📤 Broadcasting via WS to ${backendId}...`)
      sendWsMessage(backendId, text)
    } else {
      log.error('ChatView', '❌ Socket not connected, message might not be persisted')
      alert('Error: La conexión en tiempo real está desactivada. Reintenta en unos segundos.')
    }

  } catch (err) {
    log.error('ChatView', 'Error sending message', err)
  }
}

// Select a conversation
const selectConversation = async (conv: Conversation) => {
  const shortId = getConversationId(conv)
  const fullId = getStrId(conv.id)
  const backendId = getBackendId(fullId)
  
  if (!shortId || !fullId) return

  log.info('ChatView', `Selecting conversation. Short: ${shortId}, Full: ${fullId}, Backend: ${backendId}`)

  // Update URL if it's different
  if (route.params.id !== shortId) {
    router.push(`/chat/${shortId}`)
  }

  currentConversation.value = conv
  messages.value = [] // Clear messages for now
  
  if (!authStore.isAuthenticated) return
  
  try {
    // Register interest in this room via WebSocket using the backend-expected prefix
    joinConversation(backendId)

    const msgs = await apiGet<any[]>(`/conversations/${fullId}/messages`, authStore.token)
    
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

// Watch for URL changes (e.g. back button or manual edit)
watch(() => route.params.id, (newId) => {
  if (newId) {
    const allConvs = [...userGroups.value, ...userDirects.value]
    const found = allConvs.find(c => getConversationId(c) === newId)
    if (found && (!currentConversation.value || getConversationId(currentConversation.value) !== newId)) {
      selectConversation(found)
    }
  } else {
    currentConversation.value = null
    messages.value = []
  }
})

// Lifecycle
let pollInterval: any = null

onMounted(async () => {
  try {
    // Start loading conversations immediately if auth is ready
    await loadConversations()
    
    // Setup background polling for new conversations (invitations)
    pollInterval = setInterval(() => {
      if (authStore.isAuthenticated && !isLoading.value) {
        log.debug('ChatView', 'Polling for new conversations...')
        loadConversations()
      }
    }, 15000) // Every 15 seconds
    
const setupSocket = () => {
  if (!authStore.token || isSocketConnected.value) return
  
  log.info('ChatView', 'Connecting socket...')
  connectSocket(authStore.token)
}

// Always setup the listener, it will wait for the socket to be active
onEvent((event) => {
  log.info('ChatView', '📥 WS Event received:', event)
  if (event.type === 'NewMessage' && event.message) {
    log.info('ChatView', '✨ NewMessage event confirmed')
    const msg = event.message
    const senderIdStr = getStrId(msg.sender_id)
    const cleanSenderAddr = senderIdStr.includes(':') ? senderIdStr.split(':')[1] : senderIdStr
    
    const isFromMe = (cleanSenderAddr.toLowerCase() === currentMatchId.value?.toLowerCase()) || 
                     (authStore.address && cleanSenderAddr.toLowerCase() === authStore.address.toLowerCase())
    
    log.info('ChatView', `👤 Sender: ${cleanSenderAddr}. MyID: ${currentMatchId.value}. IsFromMe? ${isFromMe}`)
    
    if (!isFromMe) {
      const currentFullId = currentConversation.value ? getStrId(currentConversation.value.id) : null
      const currentBackendId = currentFullId ? getBackendId(currentFullId) : null
      const messageConvId = getStrId(msg.conversation_id || '')
      
      if (currentBackendId === messageConvId || (currentFullId && currentFullId === messageConvId)) {
        log.info('ChatView', '✅ Appending message from another user to UI')
        messages.value.push({
          text: msg.content,
          sender: formatAddress(cleanSenderAddr),
          timestamp: new Date(msg.created_at).getTime()
        })
        setTimeout(scrollToBottom, 50)
      } else {
        log.info('ChatView', '⏳ Message is for another conversation, ignoring.')
      }
    } else {
      log.info('ChatView', '🙈 Message is from me, ignoring (already added locally).')
    }
  }
})

// Watch for token to connect socket
watch(() => authStore.token, (newToken) => {
  if (newToken) {
    setupSocket()
  }
}, { immediate: true })

// Focus on input when component mounts
nextTick(() => {
  const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
  if (inputElement) {
    inputElement.focus()
  }
})
    // Cleanup
    const { onUnmounted } = await import('vue')
    onUnmounted(() => {
      if (pollInterval) clearInterval(pollInterval)
    })
    
  } catch (err) {
    log.error('ChatView', 'Error setting up chat:', err)
    error.value = 'Error al inicializar el chat'
    isLoading.value = false
  }
})
</script>
