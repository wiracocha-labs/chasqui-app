<template>
  <div class="wallet-connect-card flex items-center justify-center min-h-[320px]">
    <div class="wallet-card">
      <div class="wallet-card-header">
        <h2 class="wallet-card-title">Bienvenido</h2>
        <p class="wallet-card-subtitle">Conecta tu wallet para continuar</p>
      </div>
      <div class="wallet-buttons">
        <button
          type="button"
          :disabled="connecting"
          class="wallet-btn"
          @click="$emit('connect')"
        >
          <span class="wallet-btn-icon">🦊</span>
          {{ connecting ? 'Conectando...' : 'Conectar con MetaMask' }}
        </button>
        <button
          type="button"
          :disabled="connecting"
          class="wallet-btn"
          @click="$emit('connect')"
        >
          <span class="wallet-btn-icon">🔗</span>
          {{ connecting ? 'Conectando...' : 'WalletConnect' }}
        </button>
        <button
          type="button"
          :disabled="connecting"
          class="wallet-btn"
          @click="$emit('connect')"
        >
          <span class="wallet-btn-icon">💰</span>
          {{ connecting ? 'Conectando...' : 'Coinbase Wallet' }}
        </button>
      </div>
      <div v-if="connecting" class="wallet-loading">
        <div class="wallet-spinner"></div>
        <span class="wallet-loading-text">Conectando wallet...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ connecting: boolean }>()
defineEmits(['connect'])
</script>

<style scoped>
.wallet-connect-card {
  width: 100%;
}

.wallet-card {
  background-color: var(--color-secondary);
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
  border: 1px solid rgba(46, 30, 26, 0.12);
}

.wallet-card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.wallet-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-textSecondary);
  margin: 0 0 0.25rem 0;
}

.wallet-card-subtitle {
  font-size: 0.9375rem;
  color: var(--color-textSecondary);
  opacity: 0.85;
  margin: 0;
}

.wallet-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wallet-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font-display);
  color: #fff;
  background-color: var(--color-action);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.wallet-btn:hover:not(:disabled) {
  background-color: var(--color-action-80);
  opacity: 0.95;
}

.wallet-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.wallet-btn-icon {
  font-size: 1.25rem;
}

.wallet-loading {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.wallet-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--color-brand);
  border-top-color: transparent;
  border-radius: 50%;
  animation: wallet-spin 0.8s linear infinite;
}

.wallet-loading-text {
  font-size: 0.875rem;
  color: var(--color-textSecondary);
}

@keyframes wallet-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
