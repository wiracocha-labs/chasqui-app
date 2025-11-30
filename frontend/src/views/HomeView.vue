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

    <!-- Features Section -->
    <section class="bento-grid" id="feature">
      <div class="bento-tile bento-tile--feature bento-tile--large">
        <div class="bento-content">
          <h2>✨ Características Principales</h2>
          <p>Descubre todo lo que Chasqui tiene para ofrecer</p>
        </div>
      </div>
      
      <div class="bento-tile bento-tile--feature">
        <div class="bento-content">
          <h3>🔒 Seguridad de Primera</h3>
          <p>Cifrado de extremo a extremo para todas tus conversaciones</p>
        </div>
      </div>
      
      <div class="bento-tile bento-tile--feature">
        <div class="bento-content">
          <h3>⚡️ Rendimiento</h3>
          <p>Velocidad y fluidez en cada interacción</p>
        </div>
      </div>
      
      <div class="bento-tile bento-tile--feature">
        <div class="bento-content">
          <h3>🌐 Acceso Universal</h3>
          <p>Conéctate desde cualquier dispositivo, en cualquier lugar</p>
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

    <!-- Precios Section -->
    <section class="bento-grid bento-grid--pricing" id="princing">
      <div class="bento-tile bento-tile--pricing bento-tile--full">
        <div class="bento-content">
          <h2>💎 Planes a tu Medida</h2>
          <p>Elige el plan que mejor se adapte a tus necesidades</p>
        </div>
      </div>
      
      <div class="bento-tile bento-tile--pricing">
        <div class="bento-content">
          <h3>Básico</h3>
          <p class="price">Gratis</p>
          <ul>
            <li>Chat ilimitado</li>
            <li>Hasta 10GB de almacenamiento</li>
            <li>Soporte básico</li>
          </ul>
        </div>
      </div>
      
      <div class="bento-tile bento-tile--pricing bento-tile--highlight">
        <div class="bento-content">
          <div class="popular-tag">Popular</div>
          <h3>Pro</h3>
          <p class="price">$9.99/mes</p>
          <ul>
            <li>Todo en Básico +</li>
            <li>Hasta 100GB de almacenamiento</li>
            <li>Soporte prioritario</li>
            <li>Integraciones avanzadas</li>
          </ul>
        </div>
      </div>
      
      <div class="bento-tile bento-tile--pricing">
        <div class="bento-content">
          <h3>Empresas</h3>
          <p class="price">Personalizado</p>
          <p>¿Necesitas algo más? Contáctanos para un plan a medida.</p>
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