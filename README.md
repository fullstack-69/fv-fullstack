# Form Validation Full-Stack App

A small full-stack app for exploring form validation and API contracts. The React frontend displays a list of users and provides forms to add users; the Express backend serves the user API. User data is held in memory and resets when the backend restarts.

## Branches

Each branch builds on the previous version:

| Branch     | What it demonstrates                                           |
| ---------- | -------------------------------------------------------------- |
| `no-check` | Baseline app with no API checks or form validation.            |
| `check`    | Adds form validation and API request/response checks with Zod. |
| `openapi`  | Adds OpenAPI schema generation and Swagger UI to the backend.  |
| `deploy`   | Adds Dockerfiles and Docker Compose deployment configuration.  |

Switch to a version with `git switch <branch>`, for example `git switch check`.

## Tech stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, TypeScript, Express
- Validation: Zod on the `check`, `openapi`, and `deploy` branches
- API documentation: OpenAPI and Swagger UI on the `openapi` and `deploy` branches
- Deployment: Docker and Docker Compose on the `deploy` branch

## Run locally

Requirements: Node.js (24 or later recommended) and pnpm.

The frontend and backend are separate pnpm projects. In two terminals, from the repository root:

```sh
cd backend
pnpm install
pnpm dev
```

```sh
cd frontend
pnpm install
pnpm dev
```

Open the Vite URL printed in the frontend terminal (usually `http://localhost:5173`). The provided development configuration proxies `/api` requests to the backend at `http://localhost:3001`.

The checked-in environment files provide development defaults. To change the backend port or frontend API path, update `backend/.env` and `frontend/.env` respectively; keep the Vite proxy target in `frontend/vite.config.ts` in sync if you change the backend port.

## API and documentation

The backend provides endpoints to list users, create a user, and reset the in-memory data. The frontend uses `/api/users` during local development, which Vite proxies to the backend's `/users` endpoint.

On the `openapi` and `deploy` branches, Swagger UI is available at `http://localhost:3001/api-docs` while the backend is running. The OpenAPI document is generated from the backend schemas and routes.

## Docker deployment (`deploy` branch)

The `deploy` branch includes a Compose setup under `_deploy/` for running the configured frontend and backend images. Configure image names and published ports in `_deploy/.env`, then start the stack from the repository root:

```sh
docker compose --env-file ./_deploy/.env -f ./_deploy/docker-compose.yml up -d
```

The default frontend port is `5202` and the backend port is `5201`. Open `http://localhost:5202` to use the app. To stop the stack, run:

```sh
docker compose --env-file ./_deploy/.env -f ./_deploy/docker-compose.yml down
```

The individual frontend and backend directories also contain Dockerfiles and Compose files for building and running each service separately. Those service-level Compose files use an external Docker network named `fv-net`.
