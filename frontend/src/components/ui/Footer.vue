<template>
  <footer class="footer">
    <div class="bento-container footer-main-layout">
      <!-- BLOQUE IZQUIERDO: MARCA -->
      <div >
        <div class="footer-brand-imagery">
          <img :src="portadaUrl" alt="Chasqui" class="footer-brand-img" />
          <img :src="logoUrl" alt="Chasqui Logo" class="footer-logo-overlay" />
          <div class="footer-description-badge">
            <p class="badge-text">
              Infraestructura descentralizada para equipos que trabajan por resultados.
            </p>
          </div>
        </div>
      </div>

      <!-- BLOQUE DERECHO: NAVEGACION Y LEGAL -->
      <div class="footer-right-block">
        <div class="footer-links-grid">
          <div class="footer-nav-col">
            <h4 class="footer-col-title">Plataforma</h4>
            <ul class="footer-links">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#caracteristicas">Características</a></li>
              <li><a href="#vision">Visión</a></li>
              <li><a href="#precios">Precios</a></li>
            </ul>
          </div>
          
          <div class="footer-nav-col">
            <h4 class="footer-col-title">Recursos</h4>
            <ul class="footer-links">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="https://github.com/wiracocha-labs/chasqui-app" target="_blank">Documentación</a></li>
              <li><a href="#">Soporte</a></li>
            </ul>
          </div>

          <div class="footer-nav-col">
            <h4 class="footer-col-title">Legal</h4>
            <ul class="footer-links">
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Términos</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-legal-section">
          <div class="footer-legal-row">
            <p>&copy; {{ new Date().getFullYear() }} Wiracocha Labs. Released under GNU AGPLv3.</p>
            <div class="footer-bottom-links">
              <span>Diseñado con ❤️ en los Andes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/images/logo.webp'
import portadaUrl from '@/assets/images/chasqui_portada.webp'
</script>

<style scoped>
.footer {
  position: relative;
  padding: 1.5rem 0;
  color: var(--color-text-primary);
  background-color: var(--color-terciary);
  overflow: hidden;
}

.footer .bento-container {
  position: relative;
  z-index: 2;
}

.footer-main-layout {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: stretch;
}

.footer-right-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.footer-brand-imagery {
  position: relative;
  display: inline-block;
}

.footer-brand-img {
  height: 450px;
  width: auto;
  opacity: 1;
  display: block;
  border-radius: 24px;
  border: 6px solid var(--color-accent);
  box-shadow: var(--shadow-lg);
}

.footer-logo-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
  height: 60px;
  width: auto;
  border-radius: 8px;
  border: 4px solid var(--color-terciary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 3;
}

.footer-description-badge {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-terciary);
  border: 2px solid var(--color-brand);
  border-radius: 18px;
  padding: 12px 24px;
  min-width: 380px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 4;
}

.badge-label {
  display: block;
  color: var(--color-brand);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.badge-text {
  font-size: 0.8rem;
  line-height: 1.3;
  color: var(--color-text-primary);
  opacity: 0.9;
  margin: 0;
  font-weight: 500;
}

.footer-socials {
  display: flex;
  gap: 1.5rem;
}

.social-link {
  color: var(--color-text-primary);
  font-size: 1.8rem;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.social-link:hover {
  color: var(--color-brand);
  opacity: 1;
  transform: translateY(-3px);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;
}

.footer-col-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-brand);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 2rem;
}

.footer-links a {
  color: var(--color-text-primary);
  text-decoration: none;
  opacity: 0.7;
  transition: all 0.3s ease;
  font-size: 1.3rem;
}

.footer-links a:hover {
  opacity: 1;
  color: var(--color-brand);
  padding-left: 5px;
}

.footer-legal-section {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
}

.footer-legal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.6;
  font-size: 0.875rem;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .footer-main-layout {
    flex-direction: column;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 30px 20px 60px;
  }
  
  .footer-brand-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .footer-links-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-legal-row {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
