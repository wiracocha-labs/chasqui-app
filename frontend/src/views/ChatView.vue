<template>
  <div class="h-screen overflow-hidden flex items-center justify-center bg-gray-100">
    <div class="font-sans antialiased h-screen flex w-full">
      <!-- Sidebar -->
      <div class="bg-indigo-900 text-purple-100 w-24 p-6 hidden md:block">
        <!-- Contenido del sidebar -->
      </div>

      <!-- Chat content -->
      <div class="flex-1 flex flex-col bg-white overflow-hidden">
        <!-- Top bar -->
        <div class="border-b flex px-6 py-2 items-center">
          <h1 class="text-xl font-semibold">Chat</h1>
        </div>

        <!-- Messages -->
        <div v-if="isLoading" class="flex items-center justify-center h-screen">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>Cargando mensajes...</p>
          </div>
        </div>

        <div v-else-if="error" class="flex items-center justify-center h-screen">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">¡Error! </strong>
            <span class="block sm:inline">{{ error }}</span>
            <button 
              @click="loadMessages"
              class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>

        <div v-else class="flex flex-col h-screen bg-gray-100">
          <div class="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 class="text-xl font-bold">Chat</h1>
            <div class="flex items-center">
              <div :class="`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`"></div>
              <span class="text-sm">{{ isConnected ? 'Conectado' : 'Desconectado' }}</span>
            </div>
          </div>
          
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4">
            <div v-if="messages.length === 0" class="text-center text-gray-500 mt-8">
              No hay mensajes. ¡Envía el primero!
            </div>
            
            <div v-else>
              <div 
                v-for="(msg, index) in messages" 
                :key="index" 
                :class="`mb-4 ${msg.sender === user.alias ? 'text-right' : ''}`"
              >
                <div :class="`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === user.alias 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-800'
                }`">
                  <div v-if="msg.sender !== user.alias" class="font-bold text-xs text-gray-600">
                    {{ msg.sender }}
                  </div>
                  <div class="text-sm">{{ msg.text }}</div>
                  <div class="text-xs opacity-75 mt-1">
                    {{ formatTime(msg.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message input -->
        <form @submit.prevent="sendMessage" class="p-4 border-t">
          <div class="flex items-center">
            <input
              v-model="inputMessage"
              type="text"
              class="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Escribe un mensaje..."
            />
            <button
              type="submit"
              class="bg-indigo-600 text-white px-6 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { orbitDBService } from '../services/orbitdb'

type Message = {
  text: string
  sender: string
  timestamp: number
}

const messages = ref<Message[]>([])
const inputMessage = ref('')
const isConnected = ref(false)
const isLoading = ref(true)
const error = ref<string | null>(null)
const messagesContainer = ref<HTMLDivElement>()

const user = { alias: 'Usuario' } // En una implementación real, esto vendría del store de auth

let unsubscribe: (() => void) | null = null

const loadMessages = async () => {
  try {
    error.value = null
    const existingMessages = await orbitDBService.getMessages()
    messages.value = existingMessages
    isConnected.value = true
  } catch (err) {
    console.error('Error al cargar mensajes:', err)
    error.value = 'No se pudieron cargar los mensajes. Por favor, recarga la página.'
  } finally {
    isLoading.value = false
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  try {
    await orbitDBService.addMessage({
      text: inputMessage.value,
      sender: user.alias,
    })
    inputMessage.value = ''
  } catch (err) {
    console.error('Error al enviar el mensaje:', err)
    // En una implementación real, mostrarías un mensaje de error al usuario
  }
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  loadMessages()

  // Subscribe to new messages
  unsubscribe = orbitDBService.onNewMessage((newMessage: Message) => {
    messages.value.push(newMessage)
    scrollToBottom()
  })
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>
