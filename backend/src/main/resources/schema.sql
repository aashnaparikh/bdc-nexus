-- ============================================================
-- BDC-Nexus Database Schema
-- SalesTransactions: core entity for analytics and forecasting
-- ============================================================

DROP TABLE IF EXISTS sales_transactions;

CREATE TABLE sales_transactions (
    id               BIGSERIAL      PRIMARY KEY,
    transaction_date DATE           NOT NULL,
    revenue          DECIMAL(15, 2) NOT NULL CHECK (revenue >= 0),
    customer_segment VARCHAR(100)   NOT NULL,
    region           VARCHAR(100)   NOT NULL
);

-- Index for analytics queries that filter/group by region
CREATE INDEX idx_sales_region ON sales_transactions (region);

-- Index for time-series queries used by the forecasting service
CREATE INDEX idx_sales_date ON sales_transactions (transaction_date);
