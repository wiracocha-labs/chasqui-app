<template>
  <div class="w-1/2 mx-auto flex flex-col items-center justify-center border-4 border-brand rounded-2xl p-6 bg-white shadow-sm">
    <form class="component-card p-6 space-y-4" @submit.prevent>
      <h2 class="title mb-2">Gestionar Tarea</h2>
      <div class="form-group">
        <label for="taskName" class="form-label required">Nombre de la Tarea</label>
        <input id="taskName" v-model="form.taskName" type="text" class="form-input" placeholder="Ingresa el nombre de la tarea" required />
      </div>
      <div class="form-group">
        <label for="zkProof" class="form-label">Prueba Criptográfica (solo para eERC20)</label>
        <textarea id="zkProof" v-model="form.zkProof" class="form-textarea" rows="4" placeholder="Solo requerido para transacciones privadas con eERC20"></textarea>
      </div>
      <div class="flex justify-start w-full">
        <button type="button" class="btn-secundary !w-40" :disabled="loading" @click="onGoToChat">Ir al Chat</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <button type="button" class="btn-secundary" :disabled="loading" @click="onMarkCompleted">
          Marcar Completada
        </button>
        <button type="button" class="btn-secundary" :disabled="loading" @click="onReleaseFunds">
          Liberar Pago
        </button>
        <button type="button" class="btn-secundary" :disabled="loading" @click="onCancelEscrow">
          Cancelar Tarea
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const emit = defineEmits(['markCompleted', 'releaseFunds', 'cancelEscrow'])
const props = defineProps<{ loading?: boolean }>()
const router = useRouter()

// MOCK: Datos de prueba y cambio de ID por Nombre para el video
const form = ref({
  taskName: 'backend-api',
  zkProof: '0x2d8a4f6e8d0c2b4a6f8e0d2c4b6a8f0e2d4c6b8a0f2e4d6c8b0a2f4e6d8c0b2a4f6e8d0c2b4a6f8e0d2c4b6a8f0e2d4c6b8a0f2'
})

const onMarkCompleted = () => emit('markCompleted', { ...form.value })
const onReleaseFunds = () => emit('releaseFunds', { ...form.value })
const onCancelEscrow = () => emit('cancelEscrow', { ...form.value })
const onGoToChat = () => {
  console.log('Redirecting to chat for task:', form.value.taskName)
  router.push('/chat')
}
</script>
