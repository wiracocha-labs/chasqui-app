# 🔌 Backend Integration Guide (Chasqui Server)

This document is intended for AI agents and developers working on the frontend. It defines the communication contract for the Chasqui Server.

## 🚀 Connection Configuration

- **Base URL:** `http://localhost:8080/api`
- **WebSocket URL:** `ws://localhost:8080/api/ws/chat?token=<JWT>`

## 🔐 Authentication Flow

1. **Register:** `POST /register`
   - **Payload:** `{"username": "...", "email": "...", "password": "..."}`
   - **Validation:** Username must be letters only. Email must be valid.
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

## 🛠️ API Introspection
If you have access to the server codebase, you can run the following commands to see the full list of endpoints and schemas:

```bash
cargo run -- --list-api
cargo run -- --list-ws
```

## 📋 Available REST Endpoints
- `GET /tasks`: List all tasks.
- `POST /tasks`: Create a new task.
- `PATCH /tasks/{uuid}`: Update task completion status.
- `GET /conversations`: List user's conversations.
- `POST /conversations`: Create a new direct or group chat.
- `GET /conversations/{id}/messages`: Retrieve chat history.
- `POST /conversations/{id}/add-guest`: Add guest to conversation by email (MVP - no auth required).

## 🎯 Guest Access (MVP Feature)
For demo purposes, you can add external users to conversations without authentication:

### Add Guest by Email
```bash
POST /api/conversations/conversation:uuid/add-guest
{
  "email": "guest@example.com"
}
```

**Response:**
```json
{
  "message": "Guest added successfully",
  "user_email": "guest@example.com",
  "conversation_id": "conversation:uuid"
}
```

**Notes:**
- No authentication required (MVP demo)
- User must already exist in the system
- Returns error if user not found or already a participant
