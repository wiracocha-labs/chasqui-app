<template>
  <div class="home">
    <header class="hero">
      <h1>📨 Chasqui — Comunicación descentralizada para equipos remotos</h1>
      <p class="tagline">Colabora sin fricción. Comparte sin miedo.</p>
      <p class="subtagline">La plataforma ligera, segura y comunitaria para equipos que valoran la privacidad y el foco.</p>
      <div class="actions">
        <a  class="btn">Iniciar Sesión</a>
        <a  class="btn">Ir al Chat</a>
      </div>
    </header>

    <main>
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

      <section class="features">
        <h2>⚡ Características principales</h2>
        <div class="feature-category">
          <h3>📡 Comunicación en tiempo real</h3>
          <ul>
            <li>Canales temáticos</li>
            <li>Mensajería directa</li>
            <li>Threads simples</li>
            <li>Reacciones rápidas</li>
          </ul>
        </div>
        
        <div class="feature-category">
          <h3>🔗 Integraciones esenciales</h3>
          <ul>
            <li>GitHub: PRs, issues, comentarios</li>
            <li>GitLab: MRs, issues, pipelines</li>
            <li>Google Drive: comentarios, edición, compartidos</li>
            <li>Figma: cambios en diseños y archivos</li>
            <li>Webhooks Personalizados</li>
          </ul>
        </div>

        <div class="feature-category">
          <h3>🧠 Agentes de IA (opcionales)</h3>
          <ul>
            <li>Resúmenes diarios de actividad</li>
            <li>Extractos de discusiones largas</li>
            <li>Acciones rápidas (crear tareas, etiquetas, notas)</li>
            <li>Recordatorios inteligentes</li>
          </ul>
          <p><em>(Sin moda, sin humo. IA aplicada realmente a productividad.)</em></p>
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

      <section class="pricing">
        <h2>💰 Precios – Simple y transparente</h2>
        <p>Chasqui nace para ser accesible, justo y sostenible.</p>
        
        <div class="pricing-tier">
          <h3>🆓 Plan Gratuito – Para equipos pequeños</h3>
          <p>Ideal si estás empezando o tienes un equipo de hasta 5 personas.</p>
          <p>Incluye:</p>
          <ul>
            <li>Canales ilimitados</li>
            <li>Mensajes ilimitados</li>
            <li>Integraciones básicas (GitHub, GitLab, Drive, Figma)</li>
            <li>Webhooks estándar</li>
            <li>1 agente de IA básico</li>
            <li>Historial de 90 días</li>
            <li>Hasta 5 miembros</li>
          </ul>
        </div>

        <div class="pricing-tier">
          <h3>💼 Plan Pro – Para equipos en crecimiento</h3>
          <p class="price">$5 por miembro / mes</p>
          <p>Para equipos que necesitan continuidad, privacidad y herramientas avanzadas.</p>
          <p>Incluye todo lo del plan gratuito, más:</p>
          <ul>
            <li>Miembros ilimitados</li>
            <li>Historial ilimitado</li>
            <li>Integraciones avanzadas (acciones, filtros, resúmenes)</li>
            <li>3 agentes de IA avanzados</li>
            <li>Controles administrativos</li>
            <li>Workspaces privados</li>
            <li>Soporte prioritario</li>
          </ul>
        </div>

        <div class="pricing-tier">
          <h3>🏢 Plan Enterprise — Seguridad & Escalabilidad</h3>
          <p class="price">Precio adaptado a cada organización</p>
          <p>Para empresas que necesitan auditorías, despliegues privados y personalización.</p>
          <p>Incluye todo lo del plan Pro, más:</p>
          <ul>
            <li>Despliegue self-hosted o híbrido</li>
            <li>Auditorías de seguridad</li>
            <li>Identidad descentralizada en Avalanche</li>
            <li>Encriptación E2E avanzada</li>
            <li>Agentes de IA personalizados</li>
            <li>SLA dedicado</li>
            <li>Soporte 1:1</li>
          </ul>
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
    </main>
  </div>
</template>