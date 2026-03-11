/**
 * transactionApi.js — API client for the BDC-Nexus backend.
 *
 * All requests go to /api/* which Vite proxies to http://localhost:8080 during dev.
 * In production, the same path would be served from the same origin or a configured CDN.
 */

const BASE = '/api'

// =====================================================================
// Transaction CRUD
// =====================================================================

/**
 * Fetches all sales transactions.
 * @returns {Promise<Array>} list of SalesTransaction objects
 */
export const fetchTransactions = () =>
  fetch(`${BASE}/transactions`).then(handleResponse)

/**
 * Fetches a single transaction by ID.
 * @param {number} id
 * @returns {Promise<Object>} SalesTransaction
 */
export const fetchTransactionById = (id) =>
  fetch(`${BASE}/transactions/${id}`).then(handleResponse)

/**
 * Creates a new sales transaction.
 * @param {Object} data - { transactionDate, revenue, customerSegment, region }
 * @returns {Promise<Object>} created SalesTransaction
 */
export const createTransaction = (data) =>
  fetch(`${BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse)

/**
 * Updates an existing transaction.
 * @param {number} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated SalesTransaction
 */
export const updateTransaction = (id, data) =>
  fetch(`${BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse)

/**
 * Deletes a transaction by ID.
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteTransaction = (id) =>
  fetch(`${BASE}/transactions/${id}`, { method: 'DELETE' }).then(res => {
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
  })

// =====================================================================
// Analytics
// =====================================================================

/**
 * Fetches total revenue grouped by region.
 * @returns {Promise<Object>} map of { region: totalRevenue }
 */
export const fetchRevenueByRegion = () =>
  fetch(`${BASE}/analytics/revenue-by-region`).then(handleResponse)

/**
 * Fetches the predictive revenue forecast for next month.
 * @returns {Promise<Object>} { predictedRevenue, trend, dataPointsUsed, regressionSlope }
 */
export const fetchForecast = () =>
  fetch(`${BASE}/analytics/forecast`).then(handleResponse)

// =====================================================================
// Internal helpers
// =====================================================================

async function handleResponse(res) {
  if (!res.ok) {
    const errorBody = await res.text().catch(() => 'Unknown error')
    throw new Error(`API error ${res.status}: ${errorBody}`)
  }
  // 204 No Content has no body
  if (res.status === 204) return null
  return res.json()
}
