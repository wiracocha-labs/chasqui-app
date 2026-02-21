<template>
  <div class="home">
    <!-- Fixed Background -->
    <div class="fixed-background" :style="{ backgroundImage: `url('${heroBg}')` }"></div>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="bento-container">
        <header id="hero-bento" class="bento-grid">

          <div id="hero-main-content" class="bento-main reveal">
              <div>
                <h1>
                  <span class="text-brand">📨 Chasqui</span> — Privacidad y coordinación para equipos remotos
                </h1>
                <p class="tagline">
                  La alternativa ética y eficiente para equipos remotos. Gestiona tu comunicación, coordina por objetivos y asegura tus pagos automáticamente en un solo lugar. Sin vigilancia, sin complicaciones.
                </p>
              </div>
              
              <div class="hero-actions">
                <button class="btn btn--primary">Empezar Gratis</button>
                <button class="btn btn--outline">Ver Documentación</button>
              </div>
            </div>

            <!-- 2. Box 1: Imagen Pequeña Arriba a la Derecha -->
            <div id="box1" class="bento-box reveal" :style="{ backgroundImage: `url('${heroBox1}')`, backgroundSize: 'cover', backgroundPosition: 'center' }">
            </div>

            <!-- 3. Box 2: Imagen Larga Vertical a la Derecha (1x2) -->
            <div id="box2" class="bento-box bento-tall reveal" :style="{ backgroundImage: `url('${heroBox2}')`, backgroundSize: 'cover', backgroundPosition: 'center' }">
            </div>

            <!-- 4. Box 3: Imagen Pequeña Abajo a la Izquierda -->
            <div id="box3" class="bento-box bento-feature reveal">
              <div class="feature-icon">🔒</div>
              <h3 class="feature-title">Privacidad por Diseño</h3>
              <p class="feature-desc">Tus datos, tu control. Sin rastreo.</p>
            </div>

            <!-- 5. Box 4: Imagen Pequeña Abajo al Centro -->
            <div id="box4" class="bento-box reveal" :style="{ backgroundImage: `url('${heroBox3}')`, backgroundSize: 'cover', backgroundPosition: 'center' }">
            </div>

            <!-- Personaje flotante -->
            <div class="floating-character reveal">
              <img :src="chasquiCharacter" alt="Chasqui Character" />
            </div>
        </header>
      </div>
    </section>

    <div class="content-background-wrapper">
      <!-- 1. BLOQUE IDENTIDAD: ¿Qué es? + Filosofía + Ideal para -->
      <section class="identity-section">
        <div class="bento-container split-layout">
          <div class="identity-content reveal">
            <h2>🚀 La Evolución de la Colaboración</h2>
            <p class="lead">Chasqui nace para quienes creen que el trabajo se mide por <strong>resultados, no por horas</strong>. Optimizamos para la autonomía del equipo y la tranquilidad de los clientes.</p>
            
            <div class="philosophy-box">
              <blockquote>"Privacidad real, transparencia radical y pagos sin fricción."</blockquote>
              <p>Aprendemos juntos: Fomentamos una cultura de comunicación efectiva donde los datos son tuyos y el proceso es 100% abierto.</p>
            </div>
          </div>

          <div class="identity-target reveal">
            <h3>🎯 Ideal para:</h3>
            <ul class="check-list">
              <li>
                <span class="check-icon">✅</span>
                <span><strong>Equipos Remotos:</strong> De 10 a 50 personas que buscan eficiencia.</span>
              </li>
              <li>
                <span class="check-icon">✅</span>
                <span><strong>Freelancers y Agencias:</strong> Pagos seguros sin comisiones del 30%.</span>
              </li>
              <li>
                <span class="check-icon">✅</span>
                <span><span><strong>Comunidades Open-Source:</strong> Transparencia y soberanía de datos.</span></span>
              </li>
              <li>
                <span class="check-icon">✅</span>
                <span><strong>Cualquier equipo</strong> que valore la privacidad estructural.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Sección de Características (Bento Grid existente) -->
      <section class="bento-container">
        <div class="bento-grid bento-grid--features">
          <!-- Título principal -->
          <div class="bento-tile bento-tile--header reveal">
            <div class="bento-content">
              <h2>✨ Características Principales</h2>
              <p>Todo lo que necesitas para una comunicación efectiva</p>
            </div>
          </div>
  
          <!-- Características -->
          <div class="bento-tile reveal" v-for="(feature, index) in features" :key="index">
            <div class="bento-content">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
          
          <!-- Fila 1: Acento + Imagen 1 -->
          <div 
            class="bento-tile bento-tile--full bento-tile--right reveal" 
            :style="{ backgroundImage: `url('${featureImage1}')` }"
          >
          </div>
          
          <!-- Fila 2: Imagen 2 + Acento -->
          <div 
            class="bento-tile bento-tile--full bento-tile--left feature-image-2 reveal" 
            :style="{ backgroundImage: `url('${featureImage2}')` }"
          >
          </div>

          <!-- Personajes flotantes laterales (Nivel Grid para evitar problemas de capas) -->
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
                <li><strong>Soberanía de Datos:</strong> Tu información es tuya, no de la plataforma.</li>
                <li><strong>100% Open Source:</strong> Construimos en público, para la comunidad.</li>
                <li><strong>Transparencia Radical:</strong> Roadmap y procesos siempre visibles.</li>
              </ul>
            </div>
            
            <div class="tech-card security-card reveal">
              <h3>🔍 Arquitectura Técnica del MVP</h3>
              <p>Diseñado para ser ligero, seguro y escalable. Nuestra arquitectura separa la comunicación del valor:</p>
              <ul class="tech-list tech-list--grid">
                <li><strong>Comunicación:</strong> Actix-web (Mensajería P2P y canales)</li>
                <li><strong>Frontend:</strong> VueJS / Vite (UI rápida y sin backend)</li>
                <li><strong>Webhooks:</strong> Actix-web (GitHub, Figma, Drive integration)</li>
                <li><strong>Web3:</strong> Avalanche (Identidad, firma y trazabilidad)</li>
                <li><strong>AI:</strong> OpenAI API (Resúmenes de conversaciones)</li>
                <li><strong>Infra:</strong> Fly.io / Railway (Hospedaje liviano)</li>
              </ul>
              <a href="#" class="tech-link">Ver documentación técnica en GitHub →</a>
            </div>
          </div>
        </div>
      </section>
    </div>

      <!-- Sección de Precios (Bento Grid existente) -->
      <section class="bento-container">
        <div class="bento-grid bento-grid--pricing">
          <!-- Título principal -->
          <div class="bento-tile bento-tile--2-3 reveal">
            <div class="bento-content">
              <h2>💎 Nuestros Planes</h2>
              <p>Elige el que mejor se adapte a ti</p>
            </div>
          </div>

          <!-- Caja Decorativa Superior -->
          <div class="bento-tile bento-tile--1-3 bento-tile--accent reveal">
            <div class="bento-content flex-center">
              <div class="accent-icon">🚀</div>
              <div class="accent-text">Escala tu equipo</div>
            </div>
          </div>
  
          <!-- Planes de Precios Unificados -->
          <div 
            v-for="(plan, index) in pricingPlans" 
            :key="'plan-'+index" 
            class="bento-tile reveal"
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
  
          <!-- Caja Decorativa Inferior -->
          <div class="bento-tile bento-tile--1-3 bento-tile--accent reveal">
            <div class="bento-content flex-center">
              <div class="accent-icon">🛡️</div>
              <div class="accent-text">Privacidad Total</div>
            </div>
          </div>
  
          <!-- Imagen de Pricing -->
          <div class="bento-tile bento-tile--2-3 pricing-image reveal">
            <div class="bento-content">
              <div class="box-placeholder">Imagen de Pricing</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. BLOQUE FUTURO: Roadmap + CTA -->
      <section class="future-section">
        <div class="bento-container">
          <div class="roadmap-block reveal">
            <h2>🔮 Roadmap 2026</h2>
            <div class="roadmap-items">
              <span class="roadmap-tag">Integración GitHub/GitLab</span>
              <span class="roadmap-tag">Escrow por Tareas</span>
              <span class="roadmap-tag">Mobile App</span>
              <span class="roadmap-tag">Auditoría eERC20</span>
            </div>
          </div>
          
          <div class="cta-block reveal">
            <h2>🌄 Únete al camino</h2>
            <p>Chasqui es autonomía, comunidad y privacidad.</p>
            <div class="cta-buttons">
              <a href="#" class="btn btn--primary">👉 Únete a la lista de espera</a>
              <a href="#" class="btn btn--outline">Participar en el MVP</a>
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
import chasquiCharacter from '../assets/images/chasqui_character.png'

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
    description: 'Los freelancers trabajan tranquilos y los clientes pagan por resultados verificados automáticamente.'
  },
  {
    icon: '💰',
    title: 'Pagos Automáticos',
    description: 'Utiliza eERC20 para pagos automáticos al completar tareas. Sin intermediarios y 100% privados.'
  },
  {
    icon: '🏗️',
    title: 'Gestión de Grants',
    description: 'Administra presupuestos comunitarios y proyectos Open Source con transparencia radical.'
  },
  {
    icon: '🎯',
    title: 'Trabajo por Objetivos',
    description: 'Una interfaz diseñada para la eficiencia. Menos reuniones, más cumplimiento de metas.'
  }
];

// Datos para planes de precios
const pricingPlans = [
  {
    name: 'Free',
    price: 'Gratis',
    period: '',
    features: [
      'Comunicación core',
      'Resúmenes por IA',
      'Integración GitHub/GitLab',
      'Usuarios ilimitados'
    ],
    buttonText: 'Empezar Ahora',
    featured: false
  },
  {
    name: 'Pro',
    price: '$25',
    period: 'workspace/mes',
    features: [
      'Todo en Free',
      'Escrow inteligente',
      'Pagos eERC20 ilimitados',
      'Soporte prioritario',
      'Más almacenamiento'
    ],
    buttonText: 'Prueba Gratis',
    featured: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    customText: 'Soluciones autohospedadas y despliegues a medida.',
    features: [
      'SLA garantizado',
      'Infraestructura dedicada',
      'Soporte 24/7',
      'Auditorías personalizadas'
    ],
    buttonText: 'Contactar Ventas',
    featured: false
  }
];

import { onMounted } from 'vue';

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
