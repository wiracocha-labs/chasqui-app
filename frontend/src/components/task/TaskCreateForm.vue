<template>
  <div class="w-1/2 mx-auto flex flex-col items-center justify-center border border-brand rounded-lg p-6">
    <form @submit.prevent="onSubmit" class="w-full">
      <h2 class="title mb-2">Crear nueva tarea</h2>
      <div class="form-group">
        <label for="beneficiary" class="form-label required">Beneficiario</label>
        <input id="beneficiary" v-model="form.beneficiary" type="text" class="form-input" placeholder="0x..." required />
      </div>
      <div class="form-group">
        <label for="amount" class="form-label required">Monto (ETH)</label>
        <input id="amount" v-model="form.amount" type="number" min="0" step="0.01" class="form-input" placeholder="0.1" required />
      </div>
      <div class="form-group">
        <label for="taskDescription" class="form-label required">Descripción</label>
        <textarea id="taskDescription" v-model="form.taskDescription" class="form-textarea" rows="3" placeholder="Describe la tarea a realizar..." required></textarea>
      </div>
      <div class="form-group flex items-center">
        <input id="isPrivate" v-model="form.isPrivate" type="checkbox" class="form-checkbox" />
        <label for="isPrivate" class="form-label mb-0 ml-2">Privada (pago encriptado con eERC20)</label>
      </div>
      <button type="submit" class="btn-secundary w-full">Crear tarea</button>
    </form>
  </div>
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
