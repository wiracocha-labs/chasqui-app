# Chasqui App Instructions 🏔️

This directory contains project-specific instructions and workflows for the Chasqui App.

## 🛠️ Protocolo de Interacción (CRÍTICO)
*   **Análisis Previo:** ANTES de editar cualquier archivo, el agente debe realizar un análisis exhaustivo del código afectado.
*   **Estatus Técnico:** Para tareas de Frontend, el agente DEBE seguir los estándares definidos en `[vue-best-practices](file:///Users/renzotincopa/Documents/Wiracocha/chasqui-app/.agents/skills/vue-best-practices/SKILL.md)`.
*   **Comunicación:** El agente debe reportar primero:
    1.  Posibles bugs o errores encontrados.
    2.  Oportunidades de mejora o refactorización.
    3.  Impacto del cambio propuesto.
*   **Aprobación:** Solo se debe proceder con la edición del código una vez que el usuario haya validado el análisis y la propuesta.

## Project Overview
Chasqui is a decentralized communication platform designed for remote teams. It focuses on privacy and integrated productivity.

### Key Logic & Technologies
- **Blockchain**: Avalanche C-Chain.
- **Privacy Layer**: eERC20 (Encrypted ERC20) for private payments and escrow.
- **Zero-Knowledge**: Uses ZK Proofs for task verification without sensitive data exposure.
- **Frontend**: Vue.js 3 (Composition API), TypeScript, Pinia, Tailwind CSS.
- **Development Environment**: Hardhat (Solidity development), Vite (Frontend bundling).

## Tech Stack Summary
- **Languages**: TypeScript, Solidity, Rust (Backend).
- **Frameworks**: Vue.js 3, Hardhat, Actix-Web.
- **Libraries**: ethers.js, OrbitDB, Pinia.

## Development Modes

### 🎨 Frontend-Only (UI/UX)
If the task is strictly about **styles, components, layout, or animations**:
- Use `npm run dev` to start Vite.
- You **do not** need to start a Hardhat node.
- The app may show connection errors in the console/UI, but you can continue working on the visual side.
- Use mocks in the frontend if logic is needed but the blockchain is inaccessible.

### ⛓️ Web3-Integrated
If the task involves **contracts, private payments, or data on-chain**:
- You **must** run `npm run start:local` (Hardhat node).
- You **must** deploy/update contracts with `npm run hardhat:deploy-and-update`.
- Use the `Web3Service` to interact with the network.

## Naming & Theme
- **Chasqui**: Named after Incan messengers. Maintain themes of speed, security, and decentralized communication.
- **Visuals**: Premium, glassmorphism, or modern dark mode aesthetics suggested by the project reviews.

## Repository Logic
- `frontend/`: All Vue.js components, views, and services.
- `web3/`: All Solidity contracts, Hardhat scripts, and tests.
- `deployments/`: Contract addresses and deployment history.
- `.agent/roadmap-web2.md`: Roadmap for Backend, AI, and UI tasks.
- `.agent/roadmap-web3.md`: Roadmap for Smart Contracts and Blockchain tasks.
- `.agent/instructions.md`: This file.

## 🎨 Design System & UI Components

Para mantener la consistencia visual ("Bento Aesthetic"), el agente DEBE usar estas clases y patrones:

### 1. Avatares y Contenedores
- **Forma:** Usar cajas redondeadas (`rounded-lg` o `rounded-xl`) en lugar de círculos.
- **Dimensión Estándar:** 48x48px (`w-12 h-12`).

### 2. Componentes de Chat (reutilizables en `chat.css`)
- **`.status-badge`**: Para estados de conexión o etiquetas pequeñas (ej. "Billetera conectada"). Incluir un `<span class="dot"></span>` si se requiere un indicador visual de pulso.
- **`.sc-executed-card`**: Para alertas de Smart Contracts o transacciones automáticas. Estructura recomendada:
    ```html
    <div class="sc-executed-card">
        <div class="highlight"></div> <!-- Efecto de brillo -->
        <div class="icon-box">...</div> <!-- Icono de acción -->
        <div>
            <div class="title-box">...</div> <!-- Título -->
            <div class="content-text">...</div> <!-- Descripción -->
        </div>
    </div>
    ```

### 3. Paleta de Colores
- **Marca:** `--color-brand` (#D4AF37)
- **Fondo Primario:** `--color-terciary` (#2E1E1A)
- **Fondo Chat:** `--color-primary` (#2f2e2b)
