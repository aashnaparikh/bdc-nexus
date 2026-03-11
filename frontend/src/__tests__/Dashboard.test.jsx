/**
 * Jest Test 1: Dashboard Component
 *
 * Tests the async data loading lifecycle of the main analytics dashboard.
 * The API module is mocked so tests run without a live backend.
 */
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dashboard from '../components/Dashboard'

// Mock the entire API module — no real HTTP calls in unit tests
jest.mock('../api/transactionApi', () => ({
  fetchRevenueByRegion: jest.fn(),
  fetchForecast: jest.fn(),
  fetchTransactions: jest.fn()
}))

// Import after mocking so the mock is in place
import { fetchRevenueByRegion, fetchForecast, fetchTransactions } from '../api/transactionApi'

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  test('shows loading spinner on initial render', () => {
    // Make the promises never resolve so we can observe the loading state
    fetchRevenueByRegion.mockReturnValue(new Promise(() => {}))
    fetchForecast.mockReturnValue(new Promise(() => {}))
    fetchTransactions.mockReturnValue(new Promise(() => {}))

    render(<Dashboard />)

    // Loading indicator should be present immediately
    expect(screen.getByText(/LOADING ANALYTICS/i)).toBeInTheDocument()
  })

  test('renders revenue chart heading and KPI cards after data loads', async () => {
    fetchRevenueByRegion.mockResolvedValue({
      'North America': 350000,
      'Europe': 175000,
      'Asia Pacific': 110000
    })
    fetchForecast.mockResolvedValue({
      predictedRevenue: 98500,
      trend: 'UPWARD',
      dataPointsUsed: 12,
      regressionSlope: 4250.50
    })
    fetchTransactions.mockResolvedValue([
      {
        id: 1,
        transactionDate: '2024-01-15',
        revenue: 45200,
        customerSegment: 'Enterprise',
        region: 'North America'
      }
    ])

    render(<Dashboard />)

    // Wait for async data to load and DOM to update
    await waitFor(() => {
      expect(screen.getByText(/Revenue by Region/i)).toBeInTheDocument()
    })

    // KPI cards should be rendered
    expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument()
    expect(screen.getByText(/Total records ingested/i)).toBeInTheDocument()
    expect(screen.getByText(/Top Region/i)).toBeInTheDocument()

    // Forecast section
    expect(screen.getByText('REVENUE FORECAST')).toBeInTheDocument()
    expect(screen.getByText(/UPWARD/i)).toBeInTheDocument()
  })

  test('renders error state when API call fails', async () => {
    fetchRevenueByRegion.mockRejectedValue(new Error('Network unavailable'))
    fetchForecast.mockRejectedValue(new Error('Network unavailable'))
    fetchTransactions.mockRejectedValue(new Error('Network unavailable'))

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/SYSTEM ERROR/i)).toBeInTheDocument()
    })

    // Retry button should be visible
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument()
  })
})
