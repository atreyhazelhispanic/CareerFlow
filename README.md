# CareerFlow

A full-stack job application tracker built with Spring Boot and React. Manage applications, interviews, contacts, and notes — all behind a JWT-secured REST API with a responsive UI.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Frontend](#frontend)
- [API Documentation](#api-documentation)
- [Implementation Notes](#implementation-notes)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 25 |
| Framework | Spring Boot 3 |
| Security | Spring Security, JWT (HS256) |
| Database | PostgreSQL 16, JPA / Hibernate |
| Rate Limiting | Bucket4j |
| API Docs | Springdoc OpenAPI / Swagger UI |
| Testing | JUnit 5, Mockito |
| CI | GitHub Actions |
| Frontend | React 18, TypeScript, Vite 5 |
| UI | Bootstrap 5, React Router v6, Axios |

---

## Features

- Register and log in with email/password; all routes are JWT-protected
- Full CRUD for job applications with status tracking and pagination
- Filter applications by status and company name
- Track interviews, recruiter contacts, and notes per application
- Cascade deletes — removing an application cleans up all related records
- Rate limiting on auth endpoints (10 requests/minute)
- Interactive API documentation via Swagger UI
- Graceful error handling in the UI with inline alerts and retry actions

---

## Getting Started

### Prerequisites

- Java 25
- Maven 3.9+
- Docker (for PostgreSQL)
- Node.js 20+ (for the frontend)

### 1. Start the database

```bash
docker compose up -d
```

### 2. Run the backend

```bash
JWT_SECRET=your-secret-at-least-32-characters mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`. Vite proxies all `/api` requests to the backend automatically.

### Running tests

```bash
mvn test
```

---

## Environment Variables

### Backend

| Variable | Required | Default | Description |
|---|---|---|---|
| `JWT_SECRET` | Yes | — | HS256 signing secret (min. 32 characters) |
| `DB_URL` | No | `jdbc:postgresql://localhost:5432/careerflow` | JDBC connection URL |
| `DB_USERNAME` | No | `careerflow_user` | Database username |
| `DB_PASSWORD` | No | `careerflow_password` | Database password |
| `PORT` | No | `8080` | Server port |
| `JWT_EXPIRATION_MINUTES` | No | `60` | Token lifetime in minutes |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:5173` | Comma-separated list of allowed origins |
| `JPA_DDL_AUTO` | No | `update` | Hibernate DDL strategy |
| `LOG_LEVEL_SECURITY` | No | `INFO` | Log level for Spring Security |

### Frontend

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Backend API base URL. Override in `.env.production` for deployment |

---

## Frontend

The React + TypeScript UI lives in the `frontend/` directory.

### Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Email + password login |
| Register | `/register` | Create a new account |
| Dashboard | `/dashboard` | Paginated application list with filters and create form |
| Application Detail | `/applications/:id` | Edit application; manage interviews, contacts, and notes via tabs |

### Build for production

```bash
cd frontend
npm run build   # outputs to frontend/dist/
```

---

## API Documentation

Swagger UI is available when the backend is running:

**`http://localhost:8080/swagger-ui.html`**

### Authenticating in Swagger UI

1. Call `POST /api/auth/register` or `POST /api/auth/login`
2. Copy the `token` from the response
3. Click **Authorize** (top right), paste the token, and click **Authorize**

All subsequent requests will include the `Authorization: Bearer <token>` header automatically.

### API Groups

| Tag | Description |
|---|---|
| Auth | Register and login |
| Applications | Create, read, update, delete job applications |
| Interviews | Track interviews per application |
| Contacts | Track recruiter contacts per application |
| Notes | Add freeform notes per application |

---

## Implementation Notes

### JWT Signing

Tokens are signed with HS256 using Spring Security's `JwtEncoder`. An explicit `JwsHeader` is required so the signing algorithm is declared correctly at encoding time.

### Cascade Deletes

Deleting a job application cascades to all associated interviews, contacts, and notes via JPA `CascadeType.ALL` and `orphanRemoval = true`, preventing orphaned records and foreign key violations.

### Auth State (Frontend)

Auth state is managed by a React `AuthContext` (`src/context/AuthContext.tsx`) rather than reading `localStorage` directly in components. This ensures the NavBar and protected routes re-render immediately on login or logout.

- `login(token)` — persists the JWT to `localStorage` and updates React state
- `logout()` — clears both
- `isAuthenticated` — derived boolean used by `NavBar`, `ProtectedRoute`, and the catch-all redirect
- The Axios 401 interceptor dispatches an `auth:logout` DOM event; `AuthContext` listens and clears state reactively, letting React Router handle the redirect without a hard navigation

### Error Handling (Frontend)

`DashboardPage` and `ApplicationDetailPage` surface backend failures with descriptive inline alerts and a **Retry** button instead of leaving users on a blank spinner:

| HTTP Status | Message shown |
|---|---|
| 401 / 403 | "Your session has expired. Please log in again." |
| 404 | "Application not found." |
| Network / 5xx | "Could not load … Check your connection and try again." |