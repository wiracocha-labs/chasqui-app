<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  className: '',
})

defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  // Base classes usando Tailwind
  const baseClasses = 'inline-flex items-center justify-content gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0'
  
  // Variantes usando colores de Tailwind personalizados
  const variantClasses = {
    primary: 'bg-brand text-bg-primary hover:bg-accent focus:ring-brand shadow-sm hover:shadow-md',
    secondary: 'bg-transparent border-2 border-brand text-brand hover:bg-brand hover:text-bg-primary focus:ring-brand',
    accent: 'bg-accent text-text-primary hover:bg-brand focus:ring-accent shadow-sm hover:shadow-md',
    danger: 'bg-action text-text-primary hover:bg-red-600 focus:ring-action shadow-sm hover:shadow-md',
  }
  
  // Tamaños usando Tailwind utilities
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]} ${props.className}`
})
</script>
