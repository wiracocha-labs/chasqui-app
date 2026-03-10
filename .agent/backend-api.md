# 🔌 Backend Integration Guide (Chasqui Server)

This document is intended for AI agents and developers working on the frontend. It defines the communication contract for the Chasqui Server.

## 🚀 Connection Configuration

- **Base URL:** `http://localhost:8080/api`
- **WebSocket URL:** `ws://localhost:8080/api/ws/chat?token=<JWT>`

## 🔐 Authentication Flow

1. **Register:** `POST /register`
   - **Wallet Flow (Recommended for Demo):** `{"wallet": "0x..."}`
   - **Traditional Flow:** `{"username": "...", "email": "...", "password": "..."}`
   - **Note:** If `wallet` is provided, other fields are optional. Username will be auto-generated.
2. **Login:** `POST /login`
   - **Payload:** `{"email": "...", "password": "..."}` OR `{"username": "...", "password": "..."}`
   - **Returns:** `{"token": "<JWT>"}`
3. **Usage:** Include the token in the `Authorization` header: `Bearer <JWT>`.

## 💬 Real-Time Chat (WebSockets)

### Connection
- **URL:** `ws://localhost:8080/api/ws/chat?token=<JWT>`
- The token must be passed as a query parameter for the initial handshake.

### Client -> Server Events (JSON)
- **Join Room:**
  ```json
  {"type": "join", "conversation_id": "conv:<uuid>"}
  ```
- **Send Message:**
  ```json
  {"type": "message", "conversation_id": "conv:<uuid>", "content": "Hello world!"}
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
  - **Shorthand (Direct):** `{"target_wallet": "0x...", "conversation_type": "Direct"}` (Auto-includes you).
  - **Manual (Group/Direct):** `{"participant_ids": ["uuid", "wallet"], "conversation_type": "Direct|Group"}`.
- `GET /conversations/{id}/messages`: Retrieve chat history.
- `POST /conversations/{id}/participants`: Add participant by wallet or ID.
  - **Payload:** `{"identifier": "0x... atau tb:id"}`