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
                  <span class="text-brand">📨 Chasqui</span> — Comunicación descentralizada para equipos remotos
                </h1>
                <p class="tagline">
                  Colabora sin fricción. Comparte sin miedo. La plataforma ligera, segura y comunitaria para equipos que valoran la privacidad y el foco.
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
            <h2>🚀 ¿Qué es Chasqui?</h2>
            <p class="lead">Es una plataforma de comunicación para equipos remotos, construida sobre una arquitectura descentralizada, segura y ligera.</p>
            
            <div class="philosophy-box">
              <blockquote>"Tecnología con alma comunitaria."</blockquote>
              <p>Valores Wiracocha Labs: Sabiduría compartida y colaboración sobre competencia.</p>
            </div>
          </div>

          <div class="identity-target reveal">
            <h3>🎯 Ideal para equipos que buscan:</h3>
            <ul class="check-list">
              <li>
                <span class="check-icon">✅</span>
                <span><strong>Privacidad real:</strong> Propiedad total de tus datos.</span>
              </li>
              <li>
                <span class="check-icon">✅</span>
                <span><strong>Independencia:</strong> Sin depender de backends monolíticos.</span>
              </li>
              <li>
                <span class="check-icon">✅</span>
                <span><strong>Ahorro inteligente:</strong> No pagar $800+ al año por un chat.</span>
              </li>
              <li>
                <span class="check-icon">✅</span>
                <span><strong>Foco:</strong> Una herramienta que hace una cosa bien.</span>
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
          <div class="bento-tile bento-tile--accent">
            <div class="accent-icon">🤝</div>
            <div class="accent-text">100% Open Source</div>
          </div>
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
          <div class="bento-tile bento-tile--accent">
            <div class="accent-icon">🌍</div>
            <div class="accent-text">Nodos Globales</div>
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

      <!-- 2. BLOQUE ARQUITECTURA: Tecnología + Seguridad -->
      <section class="tech-section">
        <div class="bento-container">
          <div class="tech-grid">
            <div class="tech-card reveal">
              <h3>🛠️ El Motor (Tech Stack)</h3>
              <ul class="tech-list">
                <li><strong>Frontend:</strong> Svelte / TypeScript</li>
                <li><strong>Core P2P:</strong> GunJS</li>
                <li><strong>Web3:</strong> Avalanche (Identidad & Trazabilidad)</li>
                <li><strong>Infra:</strong> Serverless minimalista</li>
              </ul>
            </div>
            
            <div class="tech-card security-card reveal">
              <h3>🔒 Seguridad por Diseño</h3>
              <ul class="tech-list">
                <li>Tráfico Peer-to-Peer directo</li>
                <li>Cifrado extremo a extremo (roadmap)</li>
                <li>Sin minería de datos ni rastreadores</li>
                <li>Tus conversaciones no entrenan ninguna IA ajena</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>

      <!-- Sección de Precios (Bento Grid existente) -->
      <section class="bento-container">
        <div class="bento-grid bento-grid--pricing">
          <!-- Título principal -->
          <div class="bento-tile bento-tile--full bento-tile--left reveal">
            <div class="bento-content">
              <h2>💎 Nuestros Planes</h2>
              <p>Elige el que mejor se adapte a ti</p>
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
  
          <!-- Imagen de Pricing -->
          <div class="bento-tile bento-tile--full bento-tile--right pricing-image reveal">
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
            <h2>🔮 Roadmap 2024</h2>
            <div class="roadmap-items">
              <span class="roadmap-tag">Videollamadas P2P</span>
              <span class="roadmap-tag">Plugins Comunitarios</span>
              <span class="roadmap-tag">Mobile App</span>
              <span class="roadmap-tag">Panel de Métricas</span>
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
    icon: '🔒',
    title: 'Seguridad de Primera',
    description: 'Cifrado de extremo a extremo para mantener tus conversaciones privadas.'
  },
  {
    icon: '⚡',
    title: 'Rendimiento Óptimo',
    description: 'Diseñado para ser rápido y eficiente, incluso con conexiones lentas.'
  },
  {
    icon: '🌐',
    title: 'Acceso Universal',
    description: 'Disponible en todos tus dispositivos, en cualquier momento y lugar.'
  },
  {
    icon: '🤖',
    title: 'Agentes Autónomos',
    description: 'Automatiza tareas con nuestros agentes inteligentes.'
  }
];

// Datos para planes de precios
const pricingPlans = [
  {
    name: 'Básico',
    price: 'Gratis',
    period: '',
    features: [
      'Chat ilimitado',
      '10GB almacenamiento',
      'Soporte básico',
      'Hasta 5 usuarios'
    ],
    buttonText: 'Empezar Ahora',
    featured: false
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'mes',
    features: [
      'Todo en Básico',
      '100GB almacenamiento',
      'Soporte prioritario',
      'Hasta 50 usuarios',
      'Acceso a agentes'
    ],
    buttonText: 'Prueba Gratis',
    featured: true
  },
  {
    name: 'Empresas',
    price: 'Personalizado',
    period: '',
    customText: '¿Necesitas más? Contáctanos para un plan a medida.',
    features: [
      'Todo en Pro',
      'Almacenamiento ilimitado',
      'Soporte 24/7',
      'Usuarios ilimitados',
      'Personalización total'
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
