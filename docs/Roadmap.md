# Roadmap

## Business Features

- [ ] Security enhancements
- [ ] Token based authentication with scopes
- [ ] Third party authentication (e.g., OAuth)
- [ ] Implement i18n
- [ ] Partially user profile update

## Performance Optimizations

- [ ] Optimize database queries by leveraging Prisma’s query optimizations
- [ ] Implement caching strategies (e.g., Redis for session storage and frequently queried data)
- [ ] Optimize API response payloads by compressing responses (e.g., gzip, brotli)

## Scalability & Reliability

- [x] Containerize & orchestrate the backend with Docker and deploy using a scalable infrastructure (e.g., Render,
      Kubernetes)
- [ ] Load balancing & rate limiting to prevent server overload (e.g., nginx, express)
- [x] Error handling & logging with structured logs and proper HTTP error codes
- [x] Add error tracking, alerts, health checks, metrics
- [x] Making sessions stateless (e.g., Redis)

## Code Maintainability & Developer Experience

- [x] Follow Clean Architecture principles for modularity and testability
- [ ] Add API documentation with OpenAPI
- [ ] Write unit & integration tests
- [x] Ensure type safety with strict TypeScript settings
- [x] Automate CI/CD pipelines for smooth deployments
