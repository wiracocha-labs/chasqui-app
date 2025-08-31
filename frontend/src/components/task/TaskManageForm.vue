<template>
  <form class="task-manage-form component-card p-6 space-y-4" @submit.prevent>
    <h2 class="title mb-2">Gestionar Tarea</h2>
    <div class="form-group">
      <label for="escrowId" class="label">ID de la Tarea</label>
      <input id="escrowId" v-model="form.escrowId" type="number" min="1" class="input" required />
    </div>
    <div class="form-group">
      <label for="zkProof" class="label">Prueba ZK (opcional)</label>
      <textarea id="zkProof" v-model="form.zkProof" class="input" rows="2"></textarea>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <button type="button" class="btn btn-accent w-full" :disabled="!form.escrowId || loading" @click="onMarkCompleted">
        <i class="fas fa-check mr-2"></i> Marcar Completada
      </button>
      <button type="button" class="btn btn-primary w-full" :disabled="!form.escrowId || loading" @click="onReleaseFunds">
        <i class="fas fa-coins mr-2"></i> Liberar Pago
      </button>
      <button type="button" class="btn btn-danger w-full" :disabled="!form.escrowId || loading" @click="onCancelEscrow">
        <i class="fas fa-times mr-2"></i> Cancelar Tarea
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['markCompleted', 'releaseFunds', 'cancelEscrow'])
const props = defineProps<{ loading?: boolean }>()
const form = ref({
  escrowId: '',
  zkProof: ''
})
const onMarkCompleted = () => emit('markCompleted', { ...form.value })
const onReleaseFunds = () => emit('releaseFunds', { ...form.value })
const onCancelEscrow = () => emit('cancelEscrow', { ...form.value })
</script>
