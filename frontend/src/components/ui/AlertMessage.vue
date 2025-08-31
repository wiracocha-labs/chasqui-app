<template>
  <div v-if="message" :class="['alert-message', `alert-${type}`]">
    <i :class="[icon, 'mr-2']" />
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ type: string, message: string }>()
const icons: Record<string, string> = {
  success: 'fas fa-check-circle',
  error: 'fas fa-times-circle',
  warning: 'fas fa-exclamation-triangle',
  info: 'fas fa-info-circle'
}
const icon = computed(() => icons[props.type] || icons.info)
</script>


