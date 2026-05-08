# Echo

A full-stack real-time messaging application, built as both a learning project and a functional app. Inspired by the architecture of apps like Signal.

## Tech Stack

**Backend**

- Node.js, Express, TypeScript
- MongoDB with Mongoose
- JWT authentication (httpOnly cookies)
- Zod v4 for validation
- Cloudinary (profile images), Resend (email), Arcjet (security), Sentry (error monitoring)

**Frontend**

- React, Vite, TypeScript
- Tailwind CSS, shadcn/ui
- TanStack Query, Zod

**Infra / Tooling**

- Deployed on Sevalla (Express serves the built React frontend)
- Cloudinary
- Conventional commits enforced via Husky + commitlint
- ESLint + Prettier

## Project Structure

```
echo/
├── backend/      # Express API
└── frontend/     # React/Vite client
```

## Roadmap

- [x] Basic Auth (register, login, logout, profile)
- [x] Frontend auth and main pages layout
- [x] Real-time messaging via WebSockets (native)
- [ ] Add users for conversations by shareable id
- [ ] Profile image upload
- [x] Messages api integration
- [ ] Unit tests coverage
- [ ] Email confirmation logic
- [ ] Two-token JWT pattern (access + refresh)
- [ ] Migration to VPS and PostgreSQL
- [ ] Docker + CI/CD pipeline
- [ ] Mobile client (React Native)

## Why this project?

It's a deliberate deep-dive into areas I wanted to build fluency in: backend architecture, real-time systems, and production infra. The goal is to build something real while understanding the primitives, like native WebSockets and plain Node/Express before maybe migrationg to Socket.io and frameworks like NestJS.
