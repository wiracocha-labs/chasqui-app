<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="bento-container">
      <header id="hero-bento" class="bento-grid">
        <div id="hero-main-content" class="bento-main">
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
          <div id="box1" class="bento-box">
            <div class="box-placeholder">Imagen 1</div>
          </div>

          <!-- 3. Box 2: Imagen Larga Vertical a la Derecha (1x2) -->
          <div id="box2" class="bento-box bento-tall">
            <div class="box-placeholder">Imagen 2</div>
          </div>

          <!-- 4. Box 3: Imagen Pequeña Abajo a la Izquierda -->
          <div id="box3" class="bento-box bento-feature">
            <div class="feature-icon">🔒</div>
            <p class="feature-title">Privacidad por Diseño</p>
            <p class="feature-desc">Tus datos, tu control. Sin rastreo.</p>
          </div>

          <!-- 5. Box 4: Imagen Pequeña Abajo al Centro -->
          <div id="box4" class="bento-box">
            <div class="box-placeholder">Imagen 3</div>
          </div>
      </header>
    </section>

      <section class="what-is">
        <h2>🚀 ¿Qué es Chasqui?</h2>
        <p>Chasqui es una plataforma de comunicación para equipos remotos, construida sobre una arquitectura descentralizada, segura, rápida y de bajo costo operativo.</p>
        <p>Diseñada para equipos modernos que prefieren:</p>
        <ul>
          <li>Privacidad real</li>
          <li>Propiedad de sus datos</li>
          <li>Velocidad sin depender de un backend enorme</li>
          <li>Integraciones simples y útiles</li>
          <li>Una herramienta que no intenta reemplazar todo, sino hacer una cosa bien: comunicación eficiente y clara</li>
        </ul>
      </section>

      <section class="philosophy">
        <h2>🧬 Filosofía</h2>
        <blockquote>"Tecnología con alma comunitaria."</blockquote>
        <p>Chasqui nace con los valores de Wiracocha Labs:</p>
        <ul>
          <li>La sabiduría es de todos</li>
          <li>La comunidad sosteniendo a la comunidad</li>
          <li>Abrimos caminos</li>
          <li>Colaboración sobre competencia</li>
          <li>Llegar más lejos, juntos</li>
        </ul>
      </section>

      <section class="security">
        <h2>🔒 Privacidad y seguridad por diseño</h2>
        <ul>
          <li>P2P con GunJS → la mayoría del tráfico fluye entre usuarios</li>
          <li>Mínimo backend (solo webhooks e IA opcional)</li>
          <li>Datos controlados por ti</li>
          <li>Cifrado extremo a extremo para canales privados (roadmap)</li>
        </ul>
      </section>

    <!-- Sección de Características -->
    <section class="bento-container">
      <div class="bento-grid">
        <!-- Título principal -->
        <div class="bento-tile bento-tile--full">
          <div class="bento-content">
            <h2>✨ Características Principales</h2>
            <p>Todo lo que necesitas para una comunicación efectiva</p>
          </div>
        </div>

        <!-- Características -->
        <div class="bento-tile" v-for="(feature, index) in features" :key="index">
          <div class="bento-content">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

      <section class="ideal-for">
        <h2>🎯 Ideal para equipos que…</h2>
        <ul>
          <li>No quieren pagar $800–$3000 al año solo por un chat</li>
          <li>Valoran la independencia tecnológica</li>
          <li>Buscan simplicidad, velocidad y foco</li>
          <li>Prefieren privacidad antes que extracción de datos</li>
          <li>Trabajan con herramientas como GitHub, GitLab, Figma y Drive</li>
        </ul>
      </section>

      <section class="tech">
        <h2>🛠️ Tecnología</h2>
        <ul>
          <li><strong>Frontend:</strong> Svelte / TypeScript</li>
          <li><strong>P2P core:</strong> GunJS</li>
          <li><strong>Infra minimalista:</strong> Serverless para webhooks</li>
          <li><strong>Opcional Web3:</strong> Avalanche (identidades y trazabilidad)</li>
          <li><strong>Agentes:</strong> pequeñas funciones autónomas conectadas al workspace</li>
        </ul>
      </section>

    <!-- Sección de Precios -->
    <section class="bento-container">
      <div class="bento-grid bento-grid--pricing">
        <!-- Título principal -->
        <div class="bento-tile bento-tile--full">
          <div class="bento-content">
            <h2>💎 Nuestros Planes</h2>
            <p>Elige el que mejor se adapte a ti</p>
          </div>
        </div>

        <!-- Planes -->
        <div 
          v-for="(plan, index) in pricingPlans" 
          :key="'plan-'+index" 
          class="bento-tile"
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
      </div>
    </section>

      <section class="roadmap">
        <h2>🔮 Roadmap</h2>
        <ul>
          <li>Cifrado E2E en canales privados</li>
          <li>Videollamadas P2P</li>
          <li>Plugins creados por la comunidad</li>
          <li>Firma de mensajes con identidad descentralizada</li>
          <li>Panel de métricas minimalista</li>
          <li>Mobile app ligera</li>
        </ul>
      </section>

      <section class="cta">
        <h2>🌄 Únete al camino</h2>
        <p>Chasqui es más que una herramienta.</p>
        <p>Es una forma de trabajar donde la comunidad y la autonomía son centrales.</p>
        <div class="cta-buttons">
          <a href="#" class="button primary">👉 Únete a la lista de espera</a>
          <a href="#" class="button secondary">👉 Participa en el MVP en enero</a>
          <a href="#" class="button tertiary">👉 Propón features — este proyecto es abierto desde su esencia</a>
        </div>
      </section>
  </div>
</template>

<script setup>
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
</script>

<style scoped>
/* Solo estilos específicos del componente que no se pueden reutilizar */
.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style>