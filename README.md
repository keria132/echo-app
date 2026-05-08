# Echo

A full-stack real-time messaging application, built as both a learning project and a functional app. Inspired by the architecture of lightweight messenger apps.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

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

It's a deliberate deep-dive into areas I wanted to build fluency in: backend architecture, real-time systems, and production infra. The goal is to build something real while understanding the primitives, like native WebSockets and plain Node/Express before maybe migrating to Socket.io and frameworks like NestJS.
