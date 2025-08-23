<template>
  <div :class="`space-y-1 ${className}`">
    <label v-if="label" class="block text-sm font-medium text-brand">
      {{ label }}
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :class="inputClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-sm text-action">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  modelValue?: string
  disabled?: boolean
  className?: string
  label?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  className: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClasses = computed(() => {
  return `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 bg-bg-secondary text-text-primary placeholder-text-secondary ${
    props.error 
      ? 'border-action focus:ring-action focus:border-action' 
      : 'border-bg-secondary focus:ring-brand focus:border-brand'
  } ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
})
</script>
