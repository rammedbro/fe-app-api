# fe-app-api (Backend)

This repository contains the backend of the fe-app project, a car rental service. It is built with **TypeScript**
and follows a loosely implemented **Clean Architecture** approach. The backend
provides a structured, scalable API with strong type safety and separation of concerns.

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Code Structure](#code-structure)
- [API Specification](#api-specification)
- [Deployment](#deployment)
- [Running Locally](#running-locally)
- [Roadmap](./docs/Roadmap.md)
- [Changelog](./CHANGELOG.md)

## Overview

**fe-app** is a full-featured and production-ready car rental service, designed to showcase modern JavaScript
development across the backend, frontend, and platform infrastructure. The project integrates the latest
technologies, architectures, and best practices to deliver a scalable, maintainable, and high-performance solution.

It's not just a car rental service — it serves as a comprehensive reference for modern JavaScript development,
demonstrating:

- Best practices in full-stack development
- Seamless frontend-backend integration
- Scalable and maintainable architecture patterns
- Optimized developer experience with modern tooling

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Web Framework:** [Express.js](https://expressjs.com/)
- **API Specification:** [OpenAPI](https://swagger.io/specification/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Cache & Session Storage:** [Redis](https://redis.io/)
- **Authentication:** [Passport.js](http://www.passportjs.org/) (Session-based)
- **Containerization & Deployment:** [Docker](https://www.docker.com/), [Render](https://render.com/)

## Code Structure

The backend follows a modular, loosely implemented **Clean Architecture** approach for which I got more
details from this [article](https://habr.com/ru/companies/mobileup/articles/335382/) and also is inspired by
[FSD](https://feature-sliced.design/docs) architecture for frontend as they all try to achieve the same goals -
separation of concerns, low coupling and high cohesion:

```
📦 fe-app-api
 ┣ 📂 src
 ┃ ┃ # App layer
 ┃ ┣ 📂 app             # App's related code (e.g. router, middlewares)
 ┃ ┃ # Presentation layer
 ┃ ┣ 📂 controllers     # Request's handlers
 ┃ ┃ # Domain layer
 ┃ ┣ 📂 interactors     # Use cases
 ┃ ┣ 📂 entities        # Business objects
 ┃ ┃ # Data access layer
 ┃ ┣ 📂 repositories    # Object oriented abstractions over data access (e.g. ORM)
 ┃ ┃ # Shared layer
 ┃ ┣ 📂 shared          # Reusable functionality detached from the specifics of the business
 ┃ ┃
 ┃ ┣ 📜 index.ts        # App setup and entry point
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┣ 📜 schema.prisma    # Prisma schema
 ┣ 📜 Dockerfile       # Containerization configuration
 ┗ 📜 README.md
```

## API Specification

The backend uses [`tsoa`](https://tsoa-community.github.io/docs/) to define routes based on **OpenAPI** specifications. The API definitions are automatically generated and used for frontend integration.

### Authentication

- **Session-based authentication** using [`express-session`](https://www.npmjs.com/package/express-session) & [`passport`](http://www.passportjs.org/)
- Sessions are stored in **Redis** for persistence
- Users authenticate via standard login mechanisms

### Key Features

- **User Authentication:** Register, login, session management
- **Car Listings:** Create, update, delete, and fetch rental cars
- **Booking System:** Users can book and manage reservations
- **Admin Features:** Admins can manage users & listings

## Deployment

The backend is containerized and deployed via **Render**.

### Build & Deployment Steps:

1. **Build Docker Image:**
   ```sh
   docker build -t fe-app-api .
   ```
2. **Run Locally with Docker:**
   ```sh
   docker run -p 4000:4000 --env-file .env fe-app-api
   ```
3. **Deploy to Render:**
   - Render automatically builds and deploys the image from the repository.
   - Uses a **proxy** to handle incoming requests.

## Running Locally

### Prerequisites:

- [Node.js](https://nodejs.org/) & [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

### Steps:

1. **Install dependencies:**
   ```sh
   pnpm install
   ```
2. **Up infrastructure:**
   ```sh
   docker compose up
   ```
3. **Run database migrations:**
   ```sh
   dotenvx run -- prisma migrate dev --skip-generate
   ```
4. **Start the server:**
   ```sh
   pnpm run dev
   ```

---

fe-app-api © 2025 by Ramil Sharipov is licensed under CC BY-NC-ND 4.0.
