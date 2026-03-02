<template>
  <div class="home">
    <Navbar />
    <!-- Fixed Background -->
    <div class="fixed-background" :style="{ backgroundImage: `url('${heroBg}')` }"></div>

    <!-- Login Modal -->
    <LoginModal :is-open="isLoginModalOpen" @close="closeLoginModal" />

    <!-- Hero Section -->
    <section id="inicio" class="hero-section">
      <div class="bento-container">
        <header id="hero-bento" class="bento-grid">

          <!-- 1. Box Título: Texto + Botones lado a lado -->
          <div id="hero-title-box" class="bento-main reveal">
            <div class="hero-title-content">
              <h1>
                <span class="text-brand">📨 Chasqui</span> — Resultados, no horas.
              </h1>
              <p class="tagline">
                Conversación que ejecuta. Pagos que se automatizan.
              </p>
              <p class="tagline-sm">
                Menos administración. Más ejecución.
              </p>
            </div>
            <div class="hero-actions-side">
              <button @click="openLoginModal" class="btn btn--primary">Ingresar</button>
              <a href="https://github.com/wiracocha-labs/chasqui-app" target="_blank" rel="noopener noreferrer" class="btn btn--outline">Ver cómo funciona</a>
            </div>
          </div>

          <!-- 3. Box Centro: Solo la imagen del chat -->
          <div id="hero-center-box" class="bento-box reveal">
            <img :src="heroCenter" alt="Chasqui Chat Preview" class="hero-center-img" />
          </div>

          <!-- 4. Box 1: Small Feature (Growth) -->
          <div id="box1" class="bento-box reveal flex-col-center">
            <div class="flex items-center mb-2">
              <span class="text-2xl">🌱</span>
              <h3 class="text-sm font-bold text-textPrimary">Crece por resultados</h3>
            </div>
            <p class="text-xs text-textSecondary text-center">Usuarios ilimitados. Sin penalización por crecimiento.</p>
          </div>

          <!-- 5. Box 2: Atmospheric Anchor (Nature/Mood) -->
          <div id="box2" class="bento-box bento-tall reveal atmospheric-anchor">
            <img :src="heroBox2" alt="Naturaleza Inka" class="anchor-img" />
            <div class="anchor-overlay">
              <div class="bento-sub-box--minimal">
                <span class="sub-box-tag--mini">Wiracocha Labs</span>
                <p class="sub-box-text--small">Open Source Heritage</p>
              </div>
            </div>
          </div>
        </header>
      </div>
    </section>

    <div class="content-background-wrapper">
      <!-- 1. BLOQUE CARACTERÍSTICAS + EXPERIENCIA (Diseño Integrado) -->
      <section id="caracteristicas" class="identity-section" style="position: relative;">
        <div class="bento-container">
          <div class="section-header reveal mb-12 text-center">
            <h2 class="text-4xl font-bold mb-4">⚡ El flujo completo de ejecución</h2>
            <p class="text-textSecondary text-xl">Desde la conversación hasta el pago, en un solo sistema.</p>
          </div>
          
          <div class="bento-grid bento-grid--features reveal mb-8">
            <!-- Características en formato Bento Tiles -->
            <div class="bento-tile reveal" v-for="(feature, index) in features" :key="'feat-'+index">
              <div class="bento-content">
                <div class="feature-icon">{{ feature.icon }}</div>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <!-- Product Preview integrado en la misma sección -->
          <div class="product-preview-block reveal text-center">
            <div class="preview-glass">
              <div class="preview-header">
                <div class="dots"><span></span><span></span><span></span></div>
                <div class="url-bar">app.chasqui.io/chat</div>
              </div>
              <div class="preview-body">
                <video
                  class="preview-img"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="none"
                >
                  <source :src="demoVideoWebm" type="video/webm" />
                  <source :src="demoVideoMp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          <!-- Personaje flotante al final de la sección -->
          <div class="floating-character floating-character--hero reveal">
            <img :src="chasquiCharacter" alt="Chasqui Hero" />
          </div>
        </div>
      </section>

      <!-- 2. BLOQUE IDENTIDAD + VALORES (Sección Unificada) -->
      <section id="vision" class="identity-section identity-section--secondary" style="position: relative;">
        <div class="bento-container">

          <!-- Encabezado de sección -->
          <div class="section-header reveal text-center mb-12">
            <h2 class="text-4xl font-bold mb-4">🚀 Nuestra Visión</h2>
            <p class="text-textSecondary text-xl">Autonomía, pagos y ejecución, en un solo sistema.</p>
          </div>

          <!-- Bento grid: Texto | (Ideal para + Mentalidad) / Arquitectura full -->
          <div class="vision-bento reveal">

            <!-- Col izquierda: Texto de Identidad -->
            <div class="vision-identity">
              <h3 class="vision-sub-title">La Evolución de la Colaboración</h3>
              <p class="lead">Chasqui nace para quienes creen que el trabajo se mide por <strong>resultados, no por horas</strong>.</p>
              <p>Optimizamos para la autonomía del equipo y la tranquilidad de quien contrata.</p>
              <p>Reducimos la fricción administrativa.</p>
              <p>Integramos la gestión de pagos dentro del flujo natural del trabajo.</p>
              <div class="philosophy-box">
                <blockquote>"Menos administración. Más ejecución."</blockquote>
                <p>La conversación no se queda en el chat.</p>
                <p>Se transforma en compromiso y termina en pago.</p>
              </div>
            </div>

            <!-- Col derecha: Ideal para (arriba) + Mentalidad (abajo) -->
            <div class="vision-sidebar">
              <div class="identity-target">
                <h3>🎯 Ideal para:</h3>
                <ul class="check-list">
                  <li><span>✅ <strong>Startups en etapa temprana</strong></span></li>
                  <li><span>✅ <strong>Equipos remotos que trabajan por objetivos</strong></span></li>
                  <li><span>✅ <strong>Proyectos Open Source con colaboradores distribuidos</strong></span></li>
                </ul>
              </div>

              <div class="tech-card mentalidad-card">
                <h3>🌱 Mentalidad Chasqui</h3>
                <ul class="tech-list">
                  <li><strong>Resultados sobre horas</strong><br>El trabajo se mide por lo que se entrega.</li>
                  <li><strong>Autonomía real</strong><br>Los equipos trabajan con claridad y responsabilidad.</li>
                  <li><strong>Pagos sin fricción</strong><br>La administración financiera es parte del sistema, no una carga adicional.</li>
                  <li><strong>Transparencia radical</strong><br>Procesos visibles y pagos verificables.</li>
                </ul>
              </div>
            </div>

            <!-- Fila completa: Arquitectura del MVP -->
            <div class="tech-card security-card vision-full-card">
              <h3>🔍 Arquitectura del MVP</h3>
              <div class="arquitectura-inner">
                <div class="arquitectura-left">
                  <p>Chasqui separa tres capas fundamentales:</p>
                  <ul class="tech-list tech-list--grid">
                    <li><strong>Conversación</strong></li>
                    <li><strong>Compromiso</strong></li>
                    <li><strong>Liquidación</strong></li>
                  </ul>
                  <p>Diseñado para ser ligero, seguro y escalable.</p>
                </div>
                <div class="arquitectura-right">
                  <h4>Stack Tecnológico</h4>
                  <ul class="tech-list tech-list--grid">
                    <li><span class="tech-badge">Actix-web</span> — Comunicación eficiente</li>
                    <li><span class="tech-badge">VueJS / Vite</span> — Interfaz reactiva</li>
                    <li><span class="tech-badge">Avalanche</span> — Identidad y trazabilidad de pagos</li>
                    <li><span class="tech-badge">OpenAI</span> — Resúmenes inteligentes</li>
                    <li><span class="tech-badge">Fly.io / Railway</span> — Infraestructura desplegable y liviana</li>
                  </ul>
                  <div class="tech-cta">
                    <a href="https://github.com/wiracocha-labs/chasqui-app" target="_blank" rel="noopener noreferrer" class="btn btn--outline">Ver arquitectura en GitHub →</a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Personajes flotantes laterales -->
          <div class="floating-side floating-side--left">
            <img :src="chasqui2" alt="Chasqui 2" />
          </div>
          <div class="floating-side floating-side--right">
            <img :src="chasqui3" alt="Chasqui 3" />
          </div>
        </div>
      </section>
    </div>

      <!-- Sección de Precios (Bento Grid existente) -->
      <section id="precios" class="pricing-section">
        <div class="bento-container bento-grid bento-grid--pricing">
          <!-- Personaje flotante en Precios -->
          <div class="floating-character floating-character--pricing reveal">
            <img :src="chasqui4" alt="Chasqui Pricing" />
          </div>
          <!-- Título principal -->
          <div class="bento-tile bento-tile--2-3 reveal">
            <div class="bento-content">
              <h2>💎 Nuestros Planes</h2>
              <p>Elige el que mejor se adapte a ti</p>
            </div>
          </div>

          <!-- Caja Decorativa Superior (Convertida a texto) -->
          <div class="bento-tile bento-tile--1-3 bento-tile--accent reveal" style="display: flex; align-items: center; justify-content: center; background: var(--color-terciary);">
            <div class="bento-content text-center">
              <h3 class="text-brand">Privacidad por Diseño</h3>
              <p class="text-sm mt-2">Tus datos te pertenecen. Eres dueño de tu propia información y del proceso.</p>
            </div>
          </div>
  
          <!-- Planes de Precios Unificados -->
          <div 
            v-for="(plan, index) in pricingPlans" 
            :key="'plan-'+index" 
            class="bento-tile pricing-plan reveal"
            :class="{'bento-tile--highlight': plan.featured}"
          >
            <div class="bento-content">
              <div v-if="plan.featured" class="popular-tag">Popular</div>
              <h3>{{ plan.name }}</h3>
              <div class="price">{{ plan.price }}<span v-if="plan.period">/{{ plan.period }}</span></div>
              <p v-if="plan.customText" class="mb-4">{{ plan.customText }}</p>
              <ul class="features-list">
                <li v-for="(feature, fIndex) in plan.features" :key="'feature-'+fIndex">
                  ✓ {{ feature }}
                </li>
              </ul>
              <button 
                class="btn mt-4" 
                :class="plan.featured ? 'btn--primary' : 'btn--outline'"
              >
                {{ plan.buttonText }}
              </button>
            </div>
          </div>
          <!-- Cajas inferiores eliminadas -->
        </div>
      </section>

      <!-- 5. FAQ SECTION -->
      <section id="faq" class="faq-section reveal">
        <div class="bento-container">
          <h2 class="text-center mb-12">Preguntas Frecuentes</h2>
          <div class="faq-accordion" style="max-width: 800px; margin: 0 auto;">
            <div 
              class="faq-item" 
              v-for="(item, index) in faqs" 
              :key="'faq-'+index"
              :class="{ 'is-open': openFaqIndex === index }"
            >
              <button class="faq-question" @click="toggleFaq(index)">
                <h3>{{ item.question }}</h3>
                <span class="faq-icon" style="color: var(--color-brand); font-size: 1.5rem; line-height: 1;">{{ openFaqIndex === index ? '−' : '+' }}</span>
              </button>
              <div class="faq-answer" v-show="openFaqIndex === index">
                <p v-html="item.answer"></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. BLOQUE FUTURO: CTA -->
      <section class="future-section">
        <div class="bento-container">
          <div class="cta-block reveal">
            <h2>🌄 Únete al camino</h2>
            <p>Chasqui es autonomía, comunidad y privacidad.</p>
            <div class="cta-buttons">
              <a href="https://github.com/wiracocha-labs/chasqui-app" target="_blank" rel="noopener noreferrer" class="btn btn--primary">👉 Visítanos en GitHub</a>
              <a href="https://tally.so/r/YOUR_ID" target="_blank" rel="noopener noreferrer" class="btn btn--outline">Unirse a la Beta</a>
            </div>
          </div>
        </div>
      </section>
  </div>
</template>

<script setup>
import heroBg from '../assets/images/fondo_wiracocha_redes_copy.webp'
import heroBox2 from '../assets/images/box2_bg_v.webp'
import heroCenter from '../assets/images/hero_bg_1.webp'
import chasquiCharacter from '../assets/images/chasqui_character.png'
import chasqui4 from '../assets/images/chasqui_4.webp'

// Imágenes de características
import demoVideoWebm from '../assets/images/demo_video_1.webm'
import demoVideoMp4 from '../assets/images/demo_video_1.mp4'
import chasqui2 from '../assets/images/chasqui_2.webp'
import chasqui3 from '../assets/images/chasqui_3.webp'

// Datos para características
const features = [
  {
    icon: '🤝',
    title: 'Objetivos Claros',
    description: 'Define qué se va a hacer, quién lo hace y cuándo está terminado. Sin ambigüedad. Sin seguimiento manual eterno.'
  },
  {
    icon: '💰',
    title: 'Pagos Integrados al Trabajo',
    description: 'Los pagos no viven en otra plataforma. No requieren hojas de cálculo. No dependen de recordatorios. Cuando el trabajo se completa y se valida, el pago se ejecuta automáticamente. Administración financiera sin fricción.'
  },
  {
    icon: '🏗️',
    title: 'Infraestructura para Startups',
    description: 'Diseñado para equipos que necesitan velocidad y claridad. Usuarios ilimitados. Presupuestos visibles. Arquitectura ligera y escalable. Crece sin reestructurar tu herramienta cada seis meses.'
  },
  {
    icon: '🎯',
    title: 'Foco en Resultados',
    description: 'No optimizamos para que envíes más mensajes. Optimizamos para que entregues más valor. Cada conversación tiene dirección. Cada entrega tiene consecuencia.'
  }
];

// Datos para planes de precios
const pricingPlans = [
  {
    name: 'Free Beta',
    price: 'Gratis',
    period: 'durante el MVP',
    features: [
      'Comunicación por canales',
      'Conversión de conversaciones en objetivos',
      'Resúmenes inteligentes',
      'Integración GitHub / GitLab',
      'Usuarios ilimitados',
      'Sin historial oculto'
    ],
    buttonText: 'Acceso Temprano',
    featured: true
  },
  {
    name: 'Pro',
    price: '-',
    period: '',
    customText: 'Lanzamiento próximamente. Únete a la lista.',
    features: [],
    buttonText: 'Lista de Espera',
    featured: false
  },
  {
    name: 'Enterprise',
    price: '-',
    period: '',
    customText: 'Soluciones a medida para corporaciones.',
    features: [],
    buttonText: 'Proximamente',
    featured: false
  }
];

const faqs = [
  {
    question: 'Si es gratis, ¿cómo gana dinero Chasqui?',
    answer: 'La versión Core es y será siempre 100% gratuita y Open Source. Hoy estamos financiados y usamos tecnologías innovadoras para minimizar costos. En el futuro, el plan Pro y donaciones mantendrán la plataforma. Nuestra cultura es la transparencia radical: todos los gastos son visibles para demostrar que tu equipo tiene el control total y que <strong>nunca usamos ni vendemos tus datos</strong>.'
  },
  {
    question: '¿Por qué Chasqui y no Slack o Discord?',
    answer: 'Slack optimiza la comunicación corporativa masiva. Discord optimiza la comunidad social. Chasqui optimiza la ejecución con responsabilidad financiera. Aquí la conversación no termina en mensajes. Termina en resultados y pagos verificables.'
  },
  {
    question: '¿Qué significa que sea "Privacy by Design"?',
    answer: 'Cumplimos con estrictos estándares de seguridad y cifrado. La verdadera novedad es que ni siquiera tenemos control sobre tus pagos: interactuamos a través de contratos inteligentes que son 100% transparentes, automáticos y autónomos, eliminando a los intermediarios.'
  },
  {
    question: '¿Necesito saber de Web3/Crypto para usar la plataforma?',
    answer: 'Durante el MVP necesitarás una wallet para la automatización de pagos. Estamos trabajando en integrar opciones tradicionales para reducir fricción. La tecnología es un medio. El foco es la ejecución.'
  },
  {
    question: '¿Cuándo estará lista la versión final?',
    answer: 'Estamos en fase Beta con roadmap público y actualizaciones periódicas. Puedes seguir el progreso o contribuir directamente al proyecto.<br><br><a href="https://github.com/wiracocha-labs/chasqui-app" target="_blank" rel="noopener noreferrer" class="btn btn--outline" style="display:inline-block; margin-top:0.75rem;">Visitar GitHub</a>'
  }
];

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../components/ui/Navbar.vue'
import LoginModal from '../components/LoginModal.vue'

const route = useRoute();
const openFaqIndex = ref(null);
const isLoginModalOpen = ref(false);

const openLoginModal = () => {
  isLoginModalOpen.value = true;
};

const closeLoginModal = () => {
  isLoginModalOpen.value = false;
};

const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index;
};

// Check if user was redirected from a protected route
onMounted(() => {
  // Check if there's a redirect query parameter
  if (route.query.redirect || route.path === '/') {
    // You could show a message like "Please login to continue"
    // For now, we'll just let the user click the login button
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll('.reveal');
  elements.forEach((el) => observer.observe(el));
});
</script>
