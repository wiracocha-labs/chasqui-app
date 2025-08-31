<template>
  <form class="task-create-form component-card p-6 space-y-4 text-primary" @submit.prevent="onSubmit">
    <h2 class="title mb-2">Crear nueva tarea</h2>
    <div class="form-group">
      <label for="beneficiary" class="label">Beneficiario</label>
      <input id="beneficiary" v-model="form.beneficiary" type="text" class="input" required />
    </div>
    <div class="form-group">
      <label for="amount" class="label">Monto (ETH)</label>
      <input id="amount" v-model="form.amount" type="number" min="0" step="0.01" class="input" required />
    </div>
    <div class="form-group">
      <label for="taskDescription" class="label">Descripción</label>
      <textarea id="taskDescription" v-model="form.taskDescription" class="input" rows="2" required></textarea>
    </div>
    <div class="form-group flex items-center">
      <input id="isPrivate" v-model="form.isPrivate" type="checkbox" class="mr-2" />
      <label for="isPrivate" class="label">Privada (escrow y monto cifrado)</label>
    </div>
    <button type="submit" class="btn-secundary w-full">Crear tarea</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['submit'])
const form = ref({
  beneficiary: '',
  amount: '',
  taskDescription: '',
  isPrivate: false
})
const onSubmit = () => {
  emit('submit', { ...form.value })
  // Opcional: limpiar el formulario
  form.value = { beneficiary: '', amount: '', taskDescription: '', isPrivate: false }
}
</script>
