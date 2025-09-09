<template>
  <div class="task-list space-y-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-textSecondary">
          <i class="fas fa-list text-action mr-3"></i>Mis Tareas
        </h2>
        <p class="text-textSecondary mt-1">Todas las tareas que has creado</p>
      </div>
      <button 
        class="btn-primary"
        :disabled="loading" 
        @click="$emit('refresh')"
      >
        <i class="fas fa-refresh mr-2" :class="{ 'animate-spin': loading }"></i> 
        {{ loading ? 'Actualizando...' : 'Actualizar Lista' }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-chat-brand mx-auto mb-4"></div>
        <p class="text-textSecondary font-medium">Cargando tareas...</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="tasks.length === 0" class="text-center py-16">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-inbox text-3xl text-textSecondary"></i>
      </div>
      <h3 class="text-xl font-semibold text-textSecondary mb-2">No hay tareas creadas</h3>
      <p class="text-textSecondary mb-6">¡Crea tu primera tarea usando la pestaña "Crear Tarea"!</p>
      <button 
        @click="$emit('create')"
        class="btn-primary"
      >
        <i class="fas fa-plus mr-2"></i> Crear Primera Tarea
      </button>
    </div>

    <!-- Tasks list -->
    <div v-else class="grid gap-4">
      <div 
        v-for="escrow in tasks" 
        :key="escrow.id"
        class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="text-xl font-bold text-textSecondary mb-1">
              <i class="fas fa-hashtag text-action mr-2"></i>Tarea {{ escrow.id }}
            </div>
            <div class="flex items-center gap-2">
              <span v-if="escrow.isPrivate" 
                    class="px-2 py-1 rounded-full text-xs font-medium bg-chat-brand-light text-chat-brand border border-chat-brand"
              >
                <i class="fas fa-shield-alt mr-1 text-action"></i> Privada
              </span>
              <span 
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-chat-accent-light text-chat-accent border border-chat-accent': escrow.isReleased,
                  'bg-chat-brand-light text-chat-brand border border-chat-brand': escrow.isCompleted && !escrow.isReleased,
                  'bg-chat-action-light text-chat-action border border-chat-action': !escrow.isCompleted
                }"
              >
                <i :class="{
                  'fas fa-check-circle': escrow.isReleased,
                  'fas fa-check': escrow.isCompleted && !escrow.isReleased,
                  'fas fa-clock': !escrow.isCompleted
                }" class="mr-1 text-action"></i>
                {{ escrow.isReleased ? 'Pagada' : escrow.isCompleted ? 'Completada' : 'Pendiente' }}
              </span>
            </div>
          </div>
          <div class="text-right text-sm text-textSecondary">
            {{ formatDate(escrow.timestamp) }}
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-xs text-textSecondary mb-1 font-medium">EJECUTOR</div>
            <div class="font-mono text-sm text-textSecondary">
              {{ escrow.beneficiary.slice(0,8) }}...{{ escrow.beneficiary.slice(-6) }}
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-xs text-textSecondary mb-1 font-medium">
              {{ escrow.isPrivate ? 'PAGO ENCRIPTADO (eERC20)' : 'PAGO PÚBLICO' }}
            </div>
            <div class="font-semibold text-sm text-textSecondary">
              {{ escrow.isPrivate 
                ? escrow.encryptedAmount.slice(0,12) + '...' 
                : escrow.publicAmount + ' ETH' 
              }}
            </div>
            <div v-if="escrow.isPrivate" class="flex items-center text-xs text-textSecondary mt-2">
              <i class="fas fa-lock mr-1 text-action"></i>
              <span>Monto encriptado con eERC20</span>
            </div>
          </div>
        </div>
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-xs text-textSecondary font-medium mb-2">DESCRIPCIÓN DE LA TAREA</div>
          <div class="text-sm text-textSecondary leading-relaxed">{{ escrow.taskDescription }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ tasks: any[], loading: boolean }>()
const emit = defineEmits(['refresh', 'create'])
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
