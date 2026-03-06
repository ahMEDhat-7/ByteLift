# ByteLift

ByteLift is a full-stack file management application that provides secure authentication and file storage services.

## Overview

ByteLift consists of a **React + TypeScript** frontend and an **Express + TypeScript** backend. It enables authenticated users to:

- Register and authenticate using email and password
- Upload files (images, video, PDF, text, etc.)
- View, download, and delete uploaded files
- Persist file metadata in PostgreSQL while storing files on disk

## Objectives

- Deliver a secure, production-ready file storage API with JWT-based authentication.
- Demonstrate a cohesive full-stack TypeScript architecture.
- Provide a maintainable codebase that supports future feature extensions.

## Key Capabilities

- JWT-based user authentication
- Middleware-protected API routes
- File upload handling via Multer
- File metadata persistence in PostgreSQL
- File download and deletion scoped to each user
- Web UI for file management and authentication flows

## Technology Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Frontend       | React, Vite, TypeScript      |
| Backend        | Node.js, Express, TypeScript |
| Database       | PostgreSQL                   |
| Authentication | JSON Web Tokens (JWT)        |
| File Handling  | Multer                       |

## Repository Layout

```
backend/      # Express API (TypeScript)
frontend/     # React client (TypeScript + Vite)
uploads/      # Stored uploaded files
```

## Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL running locally or accessible remotely

### Configuration

Create a `.env` file in `backend/` with the following values:

```env
PORT=7000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bytelift
JWT_SECRET=<your-secret>
```

Ensure the database exists:

```bash
createdb bytelift
```

## Backend (API)

### Install Dependencies

```bash
cd backend
pnpm install
```

### Build

```bash
pnpm run build
```

### Run

```bash
pnpm run start
```

### Development Mode (hot reload)

```bash
pnpm run dev
```

API listens on `http://localhost:7000` by default.

## Frontend

### Install Dependencies

```bash
cd frontend
pnpm install
```

### Run

```bash
pnpm run dev
```

Open the provided URL (typically `http://localhost:5173`).

## API Endpoints

### Authentication

- `POST /api/auth/signup` — register a new user
- `POST /api/auth/login` — authenticate and receive JWT

### File Management (requires Authorization header)

All file endpoints require: `Authorization: Bearer <token>`

- `POST /api/files/upload` — upload a file (`multipart/form-data`, field `file`)
- `GET /api/files/all` — list files belonging to the authenticated user
- `GET /api/files/:id` — download a specific file
- `DELETE /api/files/:id` — delete a specific file

## Operational Notes

- Files are stored in the `uploads/` directory.
- Database schema is initialized automatically on startup if tables are missing.

## Troubleshooting

### Backend does not start

Ensure build output exists and rerun the build:

```bash
cd backend
pnpm run build
```

### Frontend fails to start

Install dependencies and start the dev server:

```bash
cd frontend
pnpm install
pnpm run dev

```
