# Plan de Integración Frontend ↔ Backend (Chasqui)

Este documento define un plan paso a paso para unir el frontend Vue con el backend Rust (Actix-Web). Cada paso incluye una **prueba de verificación** antes de continuar al siguiente.

---

## Contexto actual

| Componente | Estado | Notas |
|------------|--------|-------|
| **Frontend** | Vue 3, Pinia, Tailwind | Auth solo con wallet (MetaMask), Chat con GunDB, Tareas con Web3 |
| **Backend** | Documentado en `backend-api.md` | Base URL: `http://localhost:8080/api`, JWT, WebSocket chat |
| **Integración** | No existe | No hay llamadas REST al backend en el frontend |

---

## Paso 0: Pre-requisitos (verificar antes de empezar)

### 0.1 Backend corriendo
```bash
# En el directorio del backend Rust (chasqui-server o similar)
cargo run
```
**Prueba:** `curl http://localhost:8080/api/health` o `curl http://localhost:8080/` debe responder algo (no 404/Connection refused).

### 0.2 Frontend corriendo
```bash
pnpm install
npm run dev
```
**Prueba:** Abrir `http://localhost:5173` y ver la app sin errores de consola críticos.

### 0.3 Endpoints del backend disponibles
Según `backend-api.md`:
- `POST /register` — Registro
- `POST /login` — Login (retorna JWT)
- `GET /tasks`, `POST /tasks`, `PATCH /tasks/{uuid}`
- `GET /conversations`, `POST /conversations`
- `GET /conversations/{id}/messages`
- WebSocket: `ws://localhost:8080/api/ws/chat?token=<JWT>`

**Prueba:** Si tienes acceso al código del backend, ejecutar:
```bash
cargo run -- --list-api
cargo run -- --list-ws
```

---

## Paso 1: Configuración base del API en el frontend

**Objetivo:** Centralizar la URL del backend y crear un cliente HTTP reutilizable.

### 1.1 Variables de entorno
Crear/actualizar `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 1.2 Añadir API config en `frontend/src/config/index.ts`
```ts
// API Backend
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  wsUrl: (token: string) => 
    `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/^http/, 'ws')}/ws/chat?token=${token}`,
  timeout: 10000
} as const
```

### 1.3 Crear servicio API (`frontend/src/services/api.ts`)
- Función `apiFetch(path, options)` que:
  - Prefija `API_CONFIG.baseUrl`
  - Añade header `Content-Type: application/json` cuando hay body
  - Opcionalmente añade `Authorization: Bearer <token>` si existe en store
  - Maneja errores HTTP (4xx, 5xx)

**Prueba Paso 1:**
```ts
// En consola del navegador o en un componente temporal
import { API_CONFIG } from '@/config'
const res = await fetch(`${API_CONFIG.baseUrl}/tasks`)
console.log(res.status, await res.text())
```
- Si backend no corre: `Failed to fetch` o `Connection refused`
- Si backend corre: `200` o `401` (sin auth) — ambos válidos para confirmar conectividad.

---

## Paso 2: Autenticación tradicional (Register + Login)

**Objetivo:** El usuario puede registrarse e iniciar sesión con email/password y obtener un JWT.

### 2.1 Extender auth store
En `frontend/src/stores/auth.ts`:
- Añadir `token: ref<string | null>(null)` para JWT
- Añadir `loginMethod: ref<'wallet' | 'email' | null>(null)`
- Nuevas acciones: `loginWithEmail(email, password)`, `register(username, email, password)`, `logout()`
- `loginWithEmail` y `register` llaman al API y guardan el token
- `isAuthenticated` debe ser `true` si hay `address` O `token`

### 2.2 Conectar LoginModal con el API
En `LoginModal.vue`:
- `handleEmailLogin` → `authStore.loginWithEmail(email, password)`
- `handleEmailRegister` → `authStore.register(registerName, email, password)`
- Eliminar el `setTimeout` simulado
- Mostrar errores del backend (ej. "Invalid credentials")

**Prueba Paso 2:**
1. Registrar usuario: `username: testuser`, `email: test@test.com`, `password: test123`
2. Verificar que no hay error y que se cierra el modal / redirige
3. Cerrar sesión (si hay botón) o recargar
4. Iniciar sesión con `test@test.com` / `test123`
5. Verificar que el token se guarda (localStorage o Pinia persist)
6. Verificar que `isAuthenticated` es `true`

---

## Paso 3: Incluir JWT en las peticiones autenticadas

**Objetivo:** Todas las llamadas al API que requieran auth incluyan `Authorization: Bearer <token>`.

### 3.1 Actualizar `apiFetch`
- Leer token desde `useAuthStore().token` (o pasar como parámetro)
- Si hay token, añadir header `Authorization: Bearer ${token}`

### 3.2 Proteger rutas
- Rutas que requieran auth (ej. `/chat`, `/tasks`) deben redirigir a login si no hay `address` ni `token`

**Prueba Paso 3:**
1. Iniciar sesión con email
2. Abrir DevTools → Network
3. Navegar a una vista que haga una petición al API (ej. tasks)
4. Verificar que la petición incluye `Authorization: Bearer <jwt>`

---

## Paso 4: Integrar Tasks (REST)

**Objetivo:** Las tareas se obtienen y modifican vía API en lugar de (o además de) blockchain.

### 4.1 Crear servicio de tareas
`frontend/src/services/tasksApi.ts`:
- `getTasks()` → `GET /tasks`
- `createTask(payload)` → `POST /tasks`
- `updateTask(uuid, payload)` → `PATCH /tasks/{uuid}`

### 4.2 Conectar con la UI
- En `useTaskManager` o vista de tareas: cargar tareas desde `tasksApi.getTasks()` al montar
- Crear/actualizar tareas vía API cuando el usuario use auth tradicional
- (Opcional) Mantener flujo Web3 para usuarios con wallet; usar API para usuarios email

**Prueba Paso 4:**
1. Usuario autenticado con email
2. Crear una tarea desde la UI
3. Verificar en Network que `POST /tasks` se envía
4. Recargar página y verificar que la tarea persiste (viene del backend)
5. Marcar tarea como completada → `PATCH /tasks/{uuid}`

---

## Paso 5: Integrar Chat (WebSocket + REST)

**Objetivo:** El chat usa el backend en lugar de GunDB cuando el usuario está autenticado con JWT.

### 5.1 Obtener conversaciones
- `GET /conversations` → listar conversaciones
- `GET /conversations/{id}/messages` → historial de mensajes

### 5.2 WebSocket para mensajes en tiempo real
- Conectar a `ws://localhost:8080/api/ws/chat?token=<JWT>`
- Enviar `{"type": "join", "conversation_id": "conv:<uuid>"}`
- Enviar `{"type": "message", "conversation_id": "conv:<uuid>", "content": "..."}`
- Escuchar eventos `NewMessage` y actualizar la UI

### 5.3 Actualizar ChatView
- Si hay JWT: usar WebSocket + REST del backend
- Si no hay JWT (o fallback): mantener GunDB o mostrar mensaje "Inicia sesión para chatear"

**Prueba Paso 5:**
1. Usuario autenticado
2. Crear o seleccionar conversación
3. Enviar mensaje
4. Verificar que llega evento `NewMessage` por WebSocket
5. Recargar y verificar que el historial se carga desde `GET /conversations/{id}/messages`

---

## Paso 6: Coexistencia Wallet + Email

**Objetivo:** Un usuario puede tener wallet conectada Y sesión email al mismo tiempo, o solo una.

### 6.1 Lógica de auth
- `isAuthenticated` = tiene `address` O tiene `token`
- Rutas protegidas aceptan cualquiera de los dos
- Para API REST: solo JWT permite llamadas autenticadas
- Para Web3: solo wallet

### 6.2 UI
- Mostrar en navbar/header si está conectado por wallet, por email, o ambos
- Botón "Cerrar sesión" limpia token y/o desconecta wallet según el caso

**Prueba Paso 6:**
1. Conectar wallet → `isAuthenticated` true, puede usar Web3
2. Cerrar wallet, iniciar sesión con email → `isAuthenticated` true, puede usar API
3. Tener ambos → verificar que ambas funcionalidades están disponibles

---

## Resumen de orden de pasos

| Paso | Descripción | Prueba clave |
|------|-------------|--------------|
| 0 | Backend y frontend corriendo | curl + navegador |
| 1 | Config API + cliente HTTP | fetch a /tasks |
| 2 | Register + Login con JWT | Registrar, login, token guardado |
| 3 | JWT en headers | Network tab con Authorization |
| 4 | Tasks REST | CRUD tareas vía API |
| 5 | Chat WebSocket + REST | Mensajes en tiempo real |
| 6 | Wallet + Email coexistencia | Ambos métodos funcionando |

---

## Notas

- **CORS:** Si el backend rechaza peticiones del frontend, configurar CORS en Actix para permitir `http://localhost:5173`.
- **Proxy en desarrollo:** Alternativa a CORS es configurar proxy en Vite hacia `localhost:8080` para que las peticiones parezcan same-origin.
- **Errores:** Crear un composable o servicio centralizado para mostrar toasts/alertas de error de API.
