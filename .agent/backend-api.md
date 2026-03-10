# 🔌 Backend Integration Guide (Chasqui Server)

This document is intended for AI agents and developers working on the frontend. It defines the communication contract for the Chasqui Server.

## 🚀 Connection Configuration

- **Base URL:** `http://localhost:8080/api`
- **WebSocket URL:** `ws://localhost:8080/api/ws/chat?token=<JWT>`

## 🔐 Authentication Flow

1. **Register:** `POST /register`
   - **Payload (Traditional):** `{"username": "...", "email": "...", "password": "..."}`
   - **Payload (Wallet):** `{"wallet": "0x1234...abcd"}`
   - **Validation:** Username must be letters only. Email must be valid. Wallet must be non-empty.
   - **Returns:** `{"create": "success", "message": "User created successfully"}`

2. **Login:** `POST /login`
   - **Payload (Traditional):** 
     ```json
     {"email": "...", "password": "..."} 
     // OR
     {"username": "...", "password": "..."}
     ```
   - **Payload (Wallet):** `{"wallet": "0x1234...abcd"}`
   - **Returns:** `{"token": "<JWT>"}`

3. **Usage:** Include the token in the `Authorization` header: `Bearer <JWT>`.

## 🎯 Wallet Authentication (Web3)
For Web3 integration, users can authenticate using their wallet address:

### Wallet Registration
```bash
POST /api/register
{
  "wallet": "0x1234567890abcdef1234567890abcdef12345678"
}
```

### Wallet Login (No Password Required)
```bash
POST /api/login
{
  "wallet": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**
- Wallet users don't need passwords
- System generates automatic username: `wallet_0x1234_uuid`
- JWT token works the same as traditional authentication

## 💬 Real-Time Chat (WebSockets)

### Connection
- **URL:** `ws://localhost:8080/api/ws/chat?token=<JWT>`
- The token must be passed as a query parameter for the initial handshake.

### Client -> Server Events (JSON)
- **Join Room:**
  ```json
  {"type": "join", "conversation_id": "conversation:<uuid>"}
  ```
- **Send Message:**
  ```json
  {"type": "message", "conversation_id": "conversation:<uuid>", "content": "Hello world!"}
  ```

### Server -> Client Events (JSON)
- **New Message:**
  ```json
  {"type": "NewMessage", "message": {"id": "msg:...", "content": "...", "sender_id": "...", "created_at": "..."}}
  ```
- **Error:**
  ```json
  {"type": "Error", "message": "Reason for failure"}
  ```

## �️ API Introspection
If you have access to the server codebase, you can run the following commands to see the full list of endpoints and schemas:

```bash
cargo run -- --list-api
cargo run -- --list-ws
```

## �📋 Available REST Endpoints
- `GET /tasks`: List all tasks.
- `POST /tasks`: Create a new task.
- `PATCH /tasks/{uuid}`: Update completion status.
- `GET /conversations`: List user's conversations.
- `POST /conversations`: Create a new chat.
  - **Shorthand (Direct):** `{"target_wallet": "0x...", "conversation_type": "direct"}` (Auto-includes you).
  - **Manual (Group/Direct):** `{"participant_ids": ["uuid", "wallet"], "conversation_type": "direct|group"}`.
- `GET /conversations/{id}/messages`: Retrieve chat history.
- `POST /conversations/{id}/participants`: Add participant by wallet or ID.
  - **Payload:** `{"identifier": "0x... atau tb:id"}`