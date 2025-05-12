## 🛠️ REST API with OpenAPI & Express

The backend exposes a structured **RESTful API** built with **Express**, handling core operations such as authentication, car listings, reservations, user profiles, and more. This is the foundation for most CRUD and data-fetching functionality in the app.

### 📄 OpenAPI Specification

All API routes are automatically documented using the **OpenAPI 3.x.x** specification. The spec is generated directly from the Express routes using [`tsoa`](https://tsoa-community.github.io/docs/), ensuring the API docs are always in sync with the codebase.

This OpenAPI spec is used to:

- Generate fully typed frontend API clients
- Serve as live documentation for development
- Validate request/response payloads during testing

The OpenAPI schema is versioned and stored within the codebase, making it portable and ready for integration with tools like Swagger UI or Redoc.

### 🧠 Typed Frontend Integration

The frontend (Vue + TypeScript) consumes the REST API via **auto-generated client code** using the OpenAPI schema. This enables:

- Fully typed API calls
- Request/response type inference
- Easier refactoring and faster development
