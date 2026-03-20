# BDC-Nexus: Agile Predictive Analytics Suite

> Full-stack enterprise analytics platform aligned with SAP Business Data Cloud (BDC)

## Overview

BDC-Nexus simulates SAP-scale business data handling, focusing on **Product Quality** and **Agile Workflow**.

| BDC Pillar | Implementation |
|---|---|
| **Business Data** | PostgreSQL `sales_transactions` + `users` schema with regional sales data |
| **Analytics** | OLS Linear Regression forecasting + regional revenue aggregation |
| **Cloud** | Docker + docker-compose, GitHub Actions CI/CD (test → build → Docker), 12-factor config |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, SAP UI5 Web Components, Tailwind CSS, Recharts |
| Backend | Java 21 + Spring Boot 3.4, Spring Data JPA, PostgreSQL 16 |
| Auth | Spring Security + JWT (jjwt 0.12, HMAC-SHA256, BCrypt) |
| API Docs | SpringDoc OpenAPI 3 + Swagger UI |
| Testing | JUnit 5 + Mockito (3 test classes, 11 tests), Jest + RTL |
| CI/CD | GitHub Actions — parallel backend/frontend jobs + Docker build |
| Containers | Docker multi-stage build, docker-compose (backend + PostgreSQL) |

---

## Quick Start

### Option A — Docker (recommended)

**Prerequisites:** Docker + Docker Compose

```bash
docker compose up --build
# Frontend (separate):
cd frontend && npm install && npm run dev
```

### Option B — Local

**Prerequisites:** Java 21, Maven 3.9+, Node.js 20 LTS, PostgreSQL 16

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE bdcnexus;"

# 2. Start backend (schema + seed data auto-applied)
cd backend && mvn spring-boot:run

# 3. Start frontend
cd frontend && npm install && npm run dev

# 4. Run tests
cd backend && mvn test
cd frontend && npm test
```

| URL | Description |
|---|---|
| `http://localhost:5173` | React dashboard |
| `http://localhost:8080/swagger-ui.html` | Interactive API docs |

---

## Authentication

Write operations (POST/PUT/DELETE) require a JWT. Read endpoints and the dashboard are public.

**Register:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "secret"}'
# → {"token": "<jwt>"}
```

**Login:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "secret"}'
# → {"token": "<jwt>"}
```

**Use the token:**
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"transactionDate":"2024-09-01","revenue":55000,"customerSegment":"Enterprise","region":"Europe"}'
```

---

## API Reference

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Create account, returns JWT |
| `POST` | `/auth/login` | No | Authenticate, returns JWT |
| `GET` | `/api/transactions` | No | List all transactions |
| `GET` | `/api/transactions/{id}` | No | Get transaction by ID |
| `POST` | `/api/transactions` | **Yes** | Add a transaction |
| `PUT` | `/api/transactions/{id}` | **Yes** | Update a transaction |
| `DELETE` | `/api/transactions/{id}` | **Yes** | Delete a transaction |
| `GET` | `/api/analytics/revenue-by-region` | No | Revenue aggregated by region |
| `GET` | `/api/analytics/forecast` | No | OLS regression forecast |

---

## Architecture

```
Browser (5173) — React + Vite + SAP UI5
        │ HTTP (Vite proxy / VITE_API_URL)
        ▼
Spring Boot (8080)
        ├── JwtAuthFilter  →  SecurityConfig (stateless, HMAC-SHA256)
        ├── AuthController  (/auth/register, /auth/login)
        ├── TransactionController
        │       ├── AnalyticsService (JPQL GROUP BY)
        │       └── ForecastService (OLS Regression)
        │              │ JPA / JDBC
        │              ▼
        PostgreSQL 16 (5432)
                ├── sales_transactions
                └── users
```

---

## Project Structure

```
bdc-nexus/
├── docker-compose.yml                   # Local dev: backend + PostgreSQL
├── .github/workflows/ci.yml            # CI: backend tests → frontend tests → Docker build
├── backend/
│   ├── Dockerfile                       # Multi-stage: Maven build → JRE Alpine runtime
│   └── src/main/java/com/bdcnexus/
│       ├── config/{SecurityConfig,JwtUtil,JwtAuthFilter,CorsConfig}.java
│       ├── controller/{AuthController,TransactionController}.java
│       ├── service/{UserService,AnalyticsService,ForecastService}.java
│       ├── model/{User,SalesTransaction}.java
│       ├── repository/{UserRepository,SalesTransactionRepository}.java
│       ├── dto/{AuthRequest,AuthResponse,ForecastResponse}.java
│       └── resources/{schema,data}.sql
└── frontend/src/
    ├── components/{Dashboard,RevenueChart,ForecastPanel,TransactionForm,LandingPage,ApiDocs}.jsx
    └── api/transactionApi.js
```

---

## CI/CD Pipeline

Three jobs run on every push:

```
push / PR
    ├── backend-test   (JUnit 5, H2 in-memory, Maven build, uploads JAR artifact)
    ├── frontend-test  (Jest + RTL, Vite production build, uploads dist artifact)
    └── docker-build   (builds backend Docker image — depends on backend-test)
            └── ci-summary  (fails CI if any job fails)
```

---

## Agile Delivery

**Sprint 1** — Backend API, PostgreSQL schema, OLS forecast engine, JUnit tests, Swagger docs, GitHub Actions CI

**Sprint 2** — React dashboard, revenue charts, transaction form, Jest tests, Vite proxy config

**Sprint 3** — JWT authentication (Spring Security + jjwt), Docker multi-stage build, docker-compose, Docker CI job
