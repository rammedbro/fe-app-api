## 📡 Event-Driven Architecture with WebSocket & AsyncAPI

### 🧩 Protocol & Transport

- **Protocol**: Custom namespaced WebSocket (via `socket.io`)
- **Transport**: WebSocket (fallbacks disabled for consistency)
- **Authentication**: Integrated with `express-session` and `passport` — users are authenticated before a socket connection is established.
- **Room-based Logic**: On connection, each socket is placed into a unique room (based on user email or ID) to isolate personal events.

### 📑 AsyncAPI Specification

To keep the real-time contract consistent and documented, the WebSocket channels are described using the **AsyncAPI 3.0.0** specification. This provides a clear schema for:

- **Channels** (namespaces or events)
- **Message payload types**
- **Publish/subscribe roles** (server/client responsibilities)
- **Example messages and schemas**

This makes it easier to:

- Understand which events are available.
- Ensure consistency between backend emitters and frontend listeners.
- Generate documentation or even mock servers/tools if needed.

The AsyncAPI spec lives alongside the codebase and evolves with the application logic.

### 🔐 Lifecycle

- `socket.connect()` is triggered **after login**.
- Server verifies the user session and registers the socket.
- Socket joins a room tied to the user (e.g., `user:email@example.com`).
- Events like `order:updated`, `notification:added`, etc., are emitted only to the active socket.
- On logout or disconnect, the socket is fully torn down to avoid leaks or ghost listeners.
