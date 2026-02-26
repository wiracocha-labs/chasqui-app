<template>
  <div class="home">
    <Navbar />
    <!-- Fixed Background -->
    <div class="fixed-background" :style="{ backgroundImage: `url('${heroBg}')` }"></div>

    <!-- Hero Section -->
    <section id="inicio" class="hero-section">
      <div class="bento-container">
        <header id="hero-bento" class="bento-grid">

          <!-- 1. Box Título: Texto + Botones lado a lado -->
          <div id="hero-title-box" class="bento-main reveal">
            <div class="hero-title-content">
              <h1>
                <span class="text-brand">📨 Chasqui</span> — El chat de gestión para startups y proyectos Open Source
              </h1>
              <p class="tagline">
                Comunicación optimizada para equipos remotos a un precio accesible.
              </p>
            </div>
            <div class="hero-actions-side">
              <button class="btn btn--primary">Empezar Gratis</button>
              <a href="https://github.com/wiracocha-labs/chasqui-app" target="_blank" rel="noopener noreferrer" class="btn btn--outline">Documentación</a>
            </div>
          </div>

          <!-- 3. Box Centro: Solo la imagen del chat -->
          <div id="hero-center-box" class="bento-box reveal">
            <img :src="heroCenter" alt="Chasqui Chat Preview" class="hero-center-img" />
          </div>

          <!-- 4. Box 1: Small Feature (Growth) -->
          <div id="box1" class="bento-box reveal flex-col-center">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🌱</span>
              <h3 class="text-sm font-bold text-textPrimary">Crece sin límites</h3>
            </div>
            <p class="text-xs text-textSecondary text-center">No te penalizamos porque tu equipo crezca, celebramos tu crecimiento.</p>
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
      <!-- Personaje flotante del Hero -->
      <!-- <div class="floating-character floating-character--hero reveal">
        <img :src="chasquiCharacter" alt="Chasqui Hero" />
      </div> -->
    </section>

    <div class="content-background-wrapper">
      <!-- 1. BLOQUE CARACTERÍSTICAS + EXPERIENCIA (Diseño Integrado) -->
      <section id="caracteristicas" class="identity-section">
        <div class="bento-container">
          <div class="section-header reveal mb-12 text-center">
            <h2 class="text-4xl font-bold mb-4">✨ Características Principales</h2>
            <p class="text-textSecondary text-xl">Todo lo que necesitas para una comunicación efectiva</p>
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
                <img :src="featureImage1" alt="Chasqui Dashboard Preview" class="preview-img" />
                <div class="preview-overlay">
                  <div class="overlay-card">
                    <span class="status-dot"></span>
                    <p>Escrow verificado: 1,500 eERC20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. BLOQUE IDENTIDAD + VISUALES (Restaurando Diseño Original) -->
      <section id="vision" class="identity-section identity-section--secondary">
        <div class="bento-container reveal">
          <!-- 2.1 Texto de Identidad (Split Layout) -->
          <div class="split-layout mb-12">
            <div class="identity-content">
              <h2>🚀 La Evolución de la Colaboración</h2>
              <p class="lead">Chasqui nace para quienes creen que el trabajo se mide por <strong>resultados, no por horas</strong>. Optimizamos para la autonomía del equipo y la tranquilidad de los clientes.</p>
              
              <div class="philosophy-box">
                <blockquote>"Menos administración, más ejecución."</blockquote>
                <p>Fomentamos una cultura de comunicación efectiva donde el foco es el avance del proyecto y la transparencia total entre colaboradores.</p>
              </div>
            </div>

            <div class="identity-target">
              <h3>🎯 Ideal para:</h3>
              <ul class="check-list">
                <li><span>✅ <strong>Startups Emergentes</strong></span></li>
                <li><span>✅ <strong>Equipos Remotos</strong></span></li>
                <li><span>✅ <strong>Freelancers</strong></span></li>
              </ul>
            </div>
          </div>

          <!-- Personajes flotantes laterales (Acompañando el texto sin cajas de imágenes) -->
          <div class="floating-side floating-side--left">
            <img :src="chasqui2" alt="Chasqui 2" />
          </div>
          <div class="floating-side floating-side--right">
            <img :src="chasqui3" alt="Chasqui 3" />
          </div>
        </div>
      </section>

      <!-- 2. BLOQUE VALORES Y EDUCACIÓN -->
      <section class="tech-section">
        <div class="bento-container">
          <div class="tech-grid">
            <div class="tech-card reveal">
              <h3>🌱 Mentalidad Chasqui</h3>
              <ul class="tech-list">
                <li><strong>Comunicación Efectiva:</strong> Menos ruido, más foco en objetivos.</li>
                <li><strong>Gestión Ágil:</strong> Herramientas simples para un crecimiento rápido.</li>
                <li><strong>100% Open Source:</strong> Construimos en público, para la comunidad.</li>
                <li><strong>Transparencia Radical:</strong> Roadmap y procesos siempre visibles.</li>
              </ul>
            </div>
            
            <div class="tech-card security-card reveal">
              <h3>🔍 Arquitectura Técnica del MVP</h3>
              <p>Diseñado para ser ligero, seguro y escalable. Nuestra arquitectura separa la comunicación del valor:</p>
              <ul class="tech-list tech-list--grid">
                <li><span class="tech-badge">Actix-web</span> Comunicación P2P y webhooks rápidos</li>
                <li><span class="tech-badge">VueJS / Vite</span> UI reactiva y sin backend pesado</li>
                <li><span class="tech-badge">Avalanche</span> Identidad, firma y trazabilidad pura</li>
                <li><span class="tech-badge">OpenAI</span> Resúmenes inteligentes de conversaciones</li>
                <li><span class="tech-badge">Fly.io / Railway</span> Hospedaje liviano y escalable</li>
              </ul>
              <div class="mt-auto pt-6">
                <a href="https://github.com/wiracocha-labs/chasqui-app" target="_blank" rel="noopener noreferrer" class="btn btn--outline w-full text-center" style="padding: 0.75rem;">Ver arquitectura en GitHub &rarr;</a>
              </div>
            </div>
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
import heroBox1 from '../assets/images/bg_hero_1.png'
import heroBox2 from '../assets/images/bg_hero_2.png'
import heroBox3 from '../assets/images/bg_hero_3.png'
import heroCenter from '../assets/images/hero_bg_1.webp'
import chasquiCharacter from '../assets/images/chasqui_character.png'
import chasqui4 from '../assets/images/chasqui_4.webp'

// Imágenes de Pricing
import precioBg1 from '../assets/images/precio_bg_1.webp'
import pricingBg2 from '../assets/images/pricing_bg_2.webp'
import precioBg3 from '../assets/images/precio_bg_3.webp'

// Imágenes de características
import featureImage1 from '../assets/images/imagen_1_caracteristicas.webp'
import featureImage2 from '../assets/images/imagen_2_caracteristicas.webp'
import chasqui2 from '../assets/images/chasqui_2.webp'
import chasqui3 from '../assets/images/chasqui_3.webp'

// Datos para características
const features = [
  {
    icon: '🤝',
    title: 'Tranquilidad Total',
    description: 'Tus colaboradores trabajan con objetivos claros y los pagos se liberan solo al finalizar el trabajo.'
  },
  {
    icon: '💰',
    title: 'Pagos por Objetivos',
    description: 'Automatiza tu nómina o pagos a freelancers basándote en hitos completados, sin procesos manuales.'
  },
  {
    icon: '🏗️',
    title: 'Escalabilidad para Startups',
    description: 'Una infraestructura que no te penaliza por crecer. Administra presupuestos y equipos de forma ágil.'
  },
  {
    icon: '🎯',
    title: 'Foco en la Entrega',
    description: 'Una interfaz optimizada para la ejecución. Menos ruido de chat, más cumplimiento de metas.'
  }
];

// Datos para planes de precios
const pricingPlans = [
  {
    name: 'Free Beta',
    price: 'Gratis',
    period: 'durante el MVP',
    features: [
      'Comunicación core (Canales)',
      'Resúmenes de hilos por IA',
      'Integración GitHub/GitLab',
      'Usuarios ilimitados'
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
    answer: 'Las versiones gratuitas de otras apps terminan ocultando tu historial y su versión de pago te cobra por usuario, lo que es difícil para startups jóvenes. Discord es excelente para la comunicación de comunidades y gaming, pero sufre de mucho ruido y le faltan integraciones nativas para flujos de trabajo. Chasqui nace para separar espacios: priorizamos la <strong>productividad, la salud y el bienestar</strong>, dándote control real sobre tu información a un precio accesible.'
  },
  {
    question: '¿Qué significa que sea "Privacy by Design"?',
    answer: 'Cumplimos con estrictos estándares de seguridad y cifrado. La verdadera novedad es que <strong>ni siquiera tenemos control sobre tus pagos</strong>: interactuamos a través de contratos inteligentes que son 100% transparentes, automáticos y autónomos, eliminando a los intermediarios.'
  },
  {
    question: '¿Necesito saber de Web3/Crypto para usar la plataforma?',
    answer: 'Para el MVP, sí necesitarás una wallet para interactuar con la automatización de pagos. Sin embargo, ya estamos planificando integrar opciones tradicionales. Constantemente daremos talleres para compartir por qué amamos la tecnología Web3 y cómo tu equipo puede ser más eficiente al ingresar a este ecosistema.'
  },
  {
    question: '¿Cuándo estará lista la versión final?',
    answer: 'Actualmente estamos en Fase Beta. Lanzaremos actualizaciones periódicas de forma transparente. Puedes seguir nuestro roadmap o aportar al ecosistema directamente en nuestro repositorio de código.<br><br><a href="https://github.com/wiracocha-labs/chasqui-app" target="_blank" rel="noopener noreferrer" class="btn btn--outline" style="display:inline-block; margin-top:0.75rem;">Visitar GitHub</a>'
  }
];

import { ref, onMounted } from 'vue';
import Navbar from '../components/ui/Navbar.vue'

const openFaqIndex = ref(null);

const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index;
};

onMounted(() => {
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
