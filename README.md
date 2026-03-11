# BDC-Nexus: Agile Predictive Analytics Suite

> **Enterprise-Grade Cloud Analytics Engine — aligned with SAP Business Data Cloud (BDC)**

[![CI Pipeline](https://github.com/YOUR_USERNAME/bdc-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/bdc-nexus/actions)

---

## Project Overview

BDC-Nexus is a full-stack enterprise analytics platform that simulates how SAP handles large-scale business data — focusing on **Product Quality** and **Agile Workflow**. It was designed to demonstrate alignment with SAP's Business Data Cloud (BDC) pillars:

| BDC Pillar | BDC-Nexus Implementation |
|---|---|
| **Business Data** | PostgreSQL `SalesTransactions` schema with regional sales data |
| **Analytics** | OLS Linear Regression forecasting engine + regional revenue aggregation |
| **Cloud** | Docker/Kubernetes-ready, GitHub Actions CI/CD, 12-factor app configuration |

---

## User Stories

> "As a **Business Analyst**, I want to visualize total revenue by region so I can identify high-performing markets and optimize supply chain allocation."

> "As a **Sales Manager**, I want to see a predictive revenue forecast for next month so I can set realistic targets and plan resource allocation."

> "As a **Data Entry Operator**, I want to submit new sales transactions through a clean web interface so the analytics engine always reflects current business data."

> "As a **DevOps Engineer**, I want automated test execution on every commit so I can be confident that code quality is maintained across all feature branches."

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast HMR, modern bundling |
| **UI Components** | SAP UI5 Web Components React | Enterprise Fiori design system |
| **Styling** | Tailwind CSS | Utility-first, no CSS bloat |
| **Charts** | Recharts | React-native, accessible bar charts |
| **Backend** | Java 21 + Spring Boot 3.4 | SAP's primary enterprise Java ecosystem |
| **ORM** | Spring Data JPA + Hibernate | Industry-standard relational mapping |
| **Database** | PostgreSQL 16 | Relational "Business Data" storage |
| **API Docs** | SpringDoc OpenAPI 3 + Swagger UI | Self-documenting REST API |
| **Testing** | JUnit 5 + Mockito (backend), Jest + RTL (frontend) | Comprehensive quality gates |
| **CI/CD** | GitHub Actions | Automated build, test, and artifact pipeline |

---

## Agile Sprint Plan

This project was structured as a two-sprint Agile delivery, simulating a real team-based development workflow.

### Sprint 1: Core API & Data Layer (Week 1)

**Goal:** Establish a production-quality backend with full API coverage and documentation.

| Story | Task | Status |
|---|---|---|
| Data Ingestion | Design `SalesTransactions` schema | Done |
| Data Ingestion | Implement PostgreSQL schema + seed data | Done |
| API Development | Build REST CRUD endpoints (`/api/transactions`) | Done |
| Analytics | Implement `AnalyticsService` — Revenue by Region (JPQL GROUP BY) | Done |
| Predictive Engine | Implement `ForecastService` — OLS Linear Regression | Done |
| Quality | Write 3 JUnit 5 tests (controller, analytics, forecast) | Done |
| Documentation | Configure SpringDoc Swagger UI at `/swagger-ui.html` | Done |
| DevOps | Set up GitHub Actions CI pipeline | Done |

**Sprint 1 Definition of Done:** All JUnit tests pass, Swagger UI renders all endpoints, Maven build produces a runnable JAR.

---

### Sprint 2: Dashboard & Frontend Integration (Week 2)

**Goal:** Deliver a polished analytics dashboard that consumes the Sprint 1 API.

| Story | Task | Status |
|---|---|---|
| Visualization | Build `RevenueChart` bar chart with Recharts | Done |
| Visualization | Build `ForecastPanel` with trend indicator | Done |
| Data Ingestion | Build `TransactionForm` with SAP UI5 Web Components | Done |
| Dashboard | Build `Dashboard` with KPI cards + transaction table | Done |
| Integration | Configure Vite proxy for local full-stack development | Done |
| Quality | Write 2 Jest tests (Dashboard async loading, Form rendering) | Done |
| CI | Add frontend test + build steps to CI pipeline | Done |

**Sprint 2 Definition of Done:** Full-stack runs locally with `npm run dev` + `mvn spring-boot:run`, Jest tests pass, production build succeeds.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Port 5173)                   │
│  React + Vite + Tailwind + SAP UI5 Web Components        │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │Dashboard │  │RevenueChart  │  │TransactionForm    │  │
│  │(KPIs +   │  │(Recharts bar │  │(SAP UI5 Button,  │  │
│  │ table)   │  │ chart)       │  │ Input, Select)   │  │
│  └──────────┘  └──────────────┘  └──────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (Vite proxy → localhost:8080)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Spring Boot Backend (Port 8080)             │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ TransactionController (/api/transactions)           │ │
│  │ TransactionController (/api/analytics/*)            │ │
│  └───────────┬──────────────────────┬─────────────────┘ │
│              │                      │                    │
│  ┌───────────▼──────┐  ┌───────────▼──────────────────┐ │
│  │ AnalyticsService │  │ ForecastService               │ │
│  │ (JPQL GROUP BY)  │  │ (OLS Linear Regression)       │ │
│  └───────────┬──────┘  └───────────┬──────────────────┘ │
│              └──────────┬───────────┘                    │
│  ┌───────────────────────▼────────────────────────────┐  │
│  │ SalesTransactionRepository (Spring Data JPA)       │  │
│  └───────────────────────┬────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────┘
                           │ JDBC
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 PostgreSQL 16 (Port 5432)                │
│                   sales_transactions                     │
│  id | transaction_date | revenue | customer_segment | region │
└─────────────────────────────────────────────────────────┘
```

### Cloud Architecture Note

In a production deployment aligned with SAP BTP Cloud Foundry:

- **Containerization:** Each service (frontend, backend, database) runs as a separate Docker container, orchestrated via `docker-compose` locally and **Kubernetes** (K8s) in production.
- **Horizontal Scaling:** The Spring Boot backend is stateless — Kubernetes can scale it to N replicas behind a load balancer automatically based on CPU/memory metrics.
- **12-Factor App:** Database credentials are injected via environment variables (never hardcoded), enabling seamless promotion from dev → staging → prod environments.
- **Service Mesh:** In production, a service mesh (Istio or Linkerd) would handle mTLS between the frontend pod and backend pod, replacing the development CORS configuration.
- **CI/CD to Cloud:** GitHub Actions artifacts (JAR + dist/) would be promoted to a container registry (e.g., Docker Hub or SAP BTP Container Registry) and deployed via Helm charts.

---

## How to Run Locally

### Prerequisites

- **Java 21** (download: https://adoptium.net)
- **Maven 3.9+** (bundled with most Java IDEs, or `brew install maven`)
- **Node.js 20 LTS** (https://nodejs.org)
- **PostgreSQL 16** running locally (or via Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16`)

### Step 1: Database Setup

```bash
# Connect to PostgreSQL and create the database
psql -U postgres -c "CREATE DATABASE bdcnexus;"
```

The schema and seed data are applied automatically by Spring Boot on startup via `schema.sql` and `data.sql`.

### Step 2: Start the Backend

```bash
cd backend
mvn spring-boot:run
```

- API base: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`

### Step 3: Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

- Dashboard: `http://localhost:5173`

### Step 4: Run Tests

```bash
# Backend JUnit tests
cd backend && mvn test

# Frontend Jest tests
cd frontend && npm test
```

---

## API Reference (Quick)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | List all sales transactions |
| `POST` | `/api/transactions` | Ingest a new sales transaction |
| `PUT` | `/api/transactions/{id}` | Update a transaction |
| `DELETE` | `/api/transactions/{id}` | Delete a transaction |
| `GET` | `/api/analytics/revenue-by-region` | Total revenue grouped by region |
| `GET` | `/api/analytics/forecast` | Next-month OLS regression forecast |

Full interactive documentation available at `http://localhost:8080/swagger-ui.html`.

---

## Predictive Analytics — Algorithm Details

The forecasting engine uses **Ordinary Least Squares (OLS) linear regression**:

1. All transactions are aggregated by calendar month (sum of revenue per month)
2. Month index (1, 2, 3...) is the independent variable `x`; monthly revenue is `y`
3. OLS formulas compute the best-fit line:
   ```
   slope     = (n·Σxy − Σx·Σy) / (n·Σx² − (Σx)²)
   intercept = (Σy − slope·Σx) / n
   forecast  = intercept + slope · (n + 1)
   ```
4. The response includes the predicted revenue, trend direction (UPWARD/DOWNWARD), slope (monthly change rate), and number of data points used

---

## Project Structure

```
bdc-nexus/
├── README.md
├── .github/
│   └── workflows/
│       └── ci.yml                          # GitHub Actions CI pipeline
├── backend/                                # Spring Boot application
│   ├── pom.xml                             # Maven dependencies (Java 21, Spring Boot 3.4)
│   └── src/
│       ├── main/
│       │   ├── java/com/bdcnexus/
│       │   │   ├── BdcNexusApplication.java
│       │   │   ├── config/CorsConfig.java
│       │   │   ├── controller/TransactionController.java
│       │   │   ├── dto/ForecastResponse.java
│       │   │   ├── model/SalesTransaction.java
│       │   │   ├── repository/SalesTransactionRepository.java
│       │   │   └── service/
│       │   │       ├── AnalyticsService.java
│       │   │       └── ForecastService.java
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── schema.sql
│       │       └── data.sql
│       └── test/
│           └── java/com/bdcnexus/
│               ├── controller/TransactionControllerTest.java
│               └── service/
│                   ├── AnalyticsServiceTest.java
│                   └── ForecastServiceTest.java
└── frontend/                               # React + Vite application
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/transactionApi.js
        ├── components/
        │   ├── Dashboard.jsx
        │   ├── ForecastPanel.jsx
        │   ├── RevenueChart.jsx
        │   └── TransactionForm.jsx
        └── __tests__/
            ├── Dashboard.test.jsx
            └── TransactionForm.test.jsx
```

---

## Git Branching Strategy (Agile Workflow)

This repository follows a structured branching model to demonstrate professional version control practices:

| Branch | Purpose |
|---|---|
| `main` | Production-ready, protected. Only accepts PRs from `develop`. |
| `develop` | Integration branch. Feature branches merge here first. |
| `feature/api-development` | Sprint 1 — REST API + analytics services |
| `feature/data-visualization` | Sprint 2 — React dashboard + charts |
| `bugfix/ui-header` | Example hotfix branch naming convention |

**Why this matters:** This workflow demonstrates understanding of Git beyond `git commit` — it shows familiarity with pull request-based code review, branch protection rules, and team collaboration patterns that are standard in enterprise SAP development teams.

---

## Quality Assurance

### Backend — JUnit 5 Test Coverage

| Test Class | Tests | What It Validates |
|---|---|---|
| `TransactionControllerTest` | 5 | HTTP status codes, JSON content type, 404 handling, response body structure |
| `AnalyticsServiceTest` | 3 | Regional revenue aggregation, empty data handling, map completeness |
| `ForecastServiceTest` | 4 | OLS regression accuracy, trend detection, insufficient data exception, monthly aggregation |

### Frontend — Jest + React Testing Library

| Test File | Tests | What It Validates |
|---|---|---|
| `Dashboard.test.jsx` | 3 | Loading spinner, async data rendering, error state with retry |
| `TransactionForm.test.jsx` | 4 | Form field presence, required field validation, submit button state |

---

## Future Enhancements

### Technical Improvements
- **Flyway Database Migrations:** Replace the `schema.sql`/`data.sql` approach with versioned Flyway migrations for safe, rollback-capable schema evolution in production.
- **Spring Security + OAuth2/OIDC:** Add authentication via SAP BTP's Identity Authentication Service (IAS), replacing the open CORS configuration with proper JWT bearer token validation.
- **Caching Layer:** Add Redis caching for the `/api/analytics/revenue-by-region` endpoint — analytical aggregations are expensive and the result changes infrequently (only when new transactions are submitted).
- **WebSocket Live Updates:** Replace the current polling approach (Dashboard re-mounts on new transaction) with a Spring WebSocket endpoint that pushes analytics updates to connected clients in real time.
- **Time-Series ML:** Upgrade from OLS linear regression to ARIMA or Prophet time-series models for seasonal forecasting — critical for retail and supply chain use cases where Q4 patterns differ significantly from Q1.
- **Multi-Tenant Architecture:** Add a `tenantId` column to `sales_transactions` and implement row-level security for SaaS deployments serving multiple business units.

