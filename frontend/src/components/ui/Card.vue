<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  padding: 'md',
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-bg-secondary rounded-lg shadow-md border border-bg-secondary'
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return `${baseClasses} ${paddingClasses[props.padding]} ${props.className}`
})
</script>
