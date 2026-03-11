# BDC-Nexus: Agile Predictive Analytics Suite

> Full-stack enterprise analytics platform aligned with SAP Business Data Cloud (BDC)

## Overview

BDC-Nexus simulates SAP-scale business data handling, focusing on **Product Quality** and **Agile Workflow**.

| BDC Pillar | Implementation |
|---|---|
| **Business Data** | PostgreSQL `SalesTransactions` schema with regional sales data |
| **Analytics** | OLS Linear Regression forecasting + regional revenue aggregation |
| **Cloud** | Docker/Kubernetes-ready, GitHub Actions CI/CD, 12-factor config |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, SAP UI5 Web Components, Tailwind CSS, Recharts |
| Backend | Java 21 + Spring Boot 3.4, Spring Data JPA, PostgreSQL 16 |
| API Docs | SpringDoc OpenAPI 3 + Swagger UI |
| Testing | JUnit 5 + Mockito, Jest + RTL |
| CI/CD | GitHub Actions |

---

## Quick Start

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

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | List all transactions |
| `POST` | `/api/transactions` | Add a transaction |
| `PUT` | `/api/transactions/{id}` | Update a transaction |
| `DELETE` | `/api/transactions/{id}` | Delete a transaction |
| `GET` | `/api/analytics/revenue-by-region` | Revenue by region |
| `GET` | `/api/analytics/forecast` | OLS regression forecast |

---

## Architecture

```
Browser (5173) — React + Vite + SAP UI5
        │ HTTP (Vite proxy)
        ▼
Spring Boot (8080) — TransactionController
        ├── AnalyticsService (JPQL GROUP BY)
        └── ForecastService (OLS Regression)
                │ JDBC
                ▼
        PostgreSQL 16 (5432) — sales_transactions
```

---

## Project Structure

```
bdc-nexus/
├── .github/workflows/ci.yml
├── backend/src/main/java/com/bdcnexus/
│   ├── controller/TransactionController.java
│   ├── service/{AnalyticsService,ForecastService}.java
│   ├── model/SalesTransaction.java
│   └── resources/{schema,data}.sql
└── frontend/src/
    ├── components/{Dashboard,RevenueChart,ForecastPanel,TransactionForm}.jsx
    └── api/transactionApi.js
```

---

## Agile Delivery

**Sprint 1** — Backend API, PostgreSQL schema, OLS forecast engine, JUnit tests, Swagger docs, CI pipeline

**Sprint 2** — React dashboard, revenue charts, transaction form, Jest tests, Vite proxy config
