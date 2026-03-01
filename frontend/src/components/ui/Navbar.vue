<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar-container">
      <div class="navbar-brand">
        <a href="#hero-bento" class="navbar-logo-link">
          <img :src="logoUrl" alt="Chasqui Logo" class="navbar-logo" />
          <span class="navbar-title">Chasqui</span>
        </a>
      </div>
      
      <div class="navbar-links" :class="{ 'is-active': isMenuOpen }">
        <a href="#inicio" class="nav-link" :class="{ active: activeSection === 'inicio' }" @click="closeMenu">Inicio</a>
        <a href="#caracteristicas" class="nav-link" :class="{ active: activeSection === 'caracteristicas' }" @click="closeMenu">Características</a>
        <a href="#vision" class="nav-link" :class="{ active: activeSection === 'vision' }" @click="closeMenu">Visión</a>
        <a href="#precios" class="nav-link" :class="{ active: activeSection === 'precios' }" @click="closeMenu">Precios</a>
        <a href="#faq" class="nav-link" :class="{ active: activeSection === 'faq' }" @click="closeMenu">FAQ</a>
        <a href="https://github.com/wiracocha-labs/chasqui-app" target="_blank" @click="closeMenu" class="nav-link">Documentación</a>
        <button
          v-if="!authStore.address"
          class="btn btn--primary mobile-only"
          :disabled="isConnecting"
          @click="startFromNavbar"
        >
          {{ isConnecting ? 'Conectando...' : 'Empezar' }}
        </button>
        <button
          v-else
          class="btn btn--outline mobile-only"
          @click="goToTasksAndClose"
        >
          {{ shortAddress }}
        </button>
      </div>

      <div class="navbar-actions">
        <button
          v-if="!authStore.address"
          class="btn btn--primary desktop-only"
          :disabled="isConnecting"
          @click="startFromNavbar"
        >
          {{ isConnecting ? 'Conectando...' : 'Empezar' }}
        </button>
        <div v-else class="wallet-menu desktop-only" ref="walletMenuRef">
          <button
            class="wallet-chip"
            @click="toggleWalletMenu"
            :title="authStore.address"
          >
            {{ shortAddress }}
          </button>
          <div v-if="isWalletMenuOpen" class="wallet-dropdown">
            <button class="wallet-dropdown-item" @click="goToTasksFromMenu">
              Ir a tareas
            </button>
            <button class="wallet-dropdown-item wallet-dropdown-item--danger" @click="handleDisconnect">
              Desconectar
            </button>
          </div>
        </div>
        <button class="mobile-menu-toggle" @click="toggleMenu" aria-label="Toggle Menu">
          <i class="fas" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import logoUrl from '../../assets/images/logo.webp'

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const activeSection = ref('inicio')
const isConnecting = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const isWalletMenuOpen = ref(false)
const walletMenuRef = ref<HTMLElement | null>(null)
const shortAddress = computed(() => {
  const addr = authStore.address
  if (!addr) return ''
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
})

let observer: IntersectionObserver | null = null

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const goToTasks = async () => {
  isWalletMenuOpen.value = false
  await router.push('/tasks')
}

const goToTasksAndClose = async () => {
  closeMenu()
  await goToTasks()
}

const goToTasksFromMenu = async () => {
  await goToTasks()
}

const toggleWalletMenu = () => {
  isWalletMenuOpen.value = !isWalletMenuOpen.value
}

const handleDisconnect = async () => {
  authStore.disconnect()
  isWalletMenuOpen.value = false
  await router.push('/')
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!walletMenuRef.value) return
  const targetNode = event.target as Node | null
  if (targetNode && !walletMenuRef.value.contains(targetNode)) {
    isWalletMenuOpen.value = false
  }
}

const startFromNavbar = async () => {
  if (isConnecting.value) return
  isConnecting.value = true
  try {
    await authStore.connectWallet()
    closeMenu()
    await goToTasks()
  } catch (error) {
    console.error('[Navbar] Error conectando wallet desde Empezar', error)
  } finally {
    isConnecting.value = false
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleDocumentClick)
  
  // Set up IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -50% 0px', // Detect sections in the top half
    threshold: [0, 0.1]
  }

  observer = new IntersectionObserver((entries) => {
    // Collect all visible sections
    const visibleSections = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => {
        // Prioritize the one closer to the top of the viewport
        return Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
      })

    if (visibleSections.length > 0) {
      activeSection.value = visibleSections[0].target.id
    }
  }, observerOptions)

  const sectionIds = ['inicio', 'caracteristicas', 'vision', 'precios', 'faq']
  sectionIds.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer?.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
  observer?.disconnect()
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.25rem 0;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  background: transparent;
}

.navbar--scrolled {
  background: rgba(47, 46, 43, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  flex-shrink: 0;
}

.navbar-logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.navbar-logo-link:hover {
  transform: scale(1.02);
}

.navbar-logo {
  height: 42px;
  width: auto;
  border-radius: 8px; /* O puedes usar 50% para que sea circular si el logo es cuadrado */
}

.navbar-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-brand);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.nav-link {
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  position: relative;
  opacity: 0.85;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-brand);
}

.nav-link:hover {
  opacity: 1;
  color: var(--color-brand);
}

.nav-link:hover::after {
  width: 100%;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-brand);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.3s ease;
}

.mobile-menu-toggle:active {
  transform: scale(0.9);
}

.mobile-only {
  display: none;
}

.wallet-chip {
  border: 1px solid rgba(212, 175, 55, 0.4);
  background: rgba(212, 175, 55, 0.12);
  color: var(--color-brand);
  border-radius: 9999px;
  padding: 0.6rem 1rem;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.25s ease;
}

.wallet-chip:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.65);
}

.wallet-menu {
  position: relative;
}

.wallet-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  min-width: 180px;
  background: rgba(47, 46, 43, 0.98);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 0.75rem;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
  overflow: hidden;
  z-index: 1200;
}

.wallet-dropdown-item {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  padding: 0.7rem 0.9rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.wallet-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.wallet-dropdown-item--danger {
  color: #f87171;
}

@media (max-width: 991px) {
  .navbar-links {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem 0;
  }
  
  .navbar-links {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    background: var(--color-primary);
    flex-direction: column;
    justify-content: center;
    padding: 3rem 2rem;
    gap: 2rem;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: 1001;
    border-left: 2px solid var(--color-brand);
  }

  .navbar-links.is-active {
    transform: translateX(0);
  }

  .nav-link {
    font-size: 1.25rem;
    width: 100%;
    text-align: center;
  }

  .mobile-menu-toggle {
    display: block;
    z-index: 1002;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
    width: 100%;
    margin-top: 1rem;
  }
}
</style>
