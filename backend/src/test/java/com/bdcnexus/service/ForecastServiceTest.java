package com.bdcnexus.service;

import com.bdcnexus.dto.ForecastResponse;
import com.bdcnexus.model.SalesTransaction;
import com.bdcnexus.repository.SalesTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

/**
 * JUnit Test 3: ForecastService — Linear Regression Unit Tests
 *
 * Validates the OLS regression algorithm with controlled data sets
 * where the expected output is mathematically deterministic.
 *
 * Tests:
 *   - Perfect linear data (10k, 20k, 30k/month) predicts 40k for month 4
 *   - Upward trend is correctly identified when slope > 0
 *   - Insufficient data throws IllegalStateException
 *   - Downward trend is correctly identified when slope < 0
 */
@DisplayName("ForecastService Linear Regression Unit Tests")
class ForecastServiceTest {

    private SalesTransactionRepository repository;
    private ForecastService forecastService;

    @BeforeEach
    void setUp() {
        repository = mock(SalesTransactionRepository.class);
        forecastService = new ForecastService(repository);
    }

    @Test
    @DisplayName("Perfect linear upward trend (10k, 20k, 30k) should predict ~40k for month 4")
    void forecastNextMonth_withPerfectLinearUpwardData_shouldPredictCorrectly() {
        List<SalesTransaction> transactions = List.of(
            buildTransaction("2024-01-15", 10_000),
            buildTransaction("2024-02-10", 20_000),
            buildTransaction("2024-03-20", 30_000)
        );
        given(repository.findAllByOrderByTransactionDateAsc()).willReturn(transactions);

        ForecastResponse result = forecastService.forecastNextMonth();

        // With x = [1,2,3], y = [10000, 20000, 30000]:
        // slope = 10000, intercept = 0, prediction for x=4 is 40000
        assertThat(result.predictedRevenue())
            .isGreaterThanOrEqualTo(new BigDecimal("38000.00"))
            .isLessThanOrEqualTo(new BigDecimal("42000.00"));
        assertThat(result.trend()).isEqualTo("UPWARD");
        assertThat(result.dataPointsUsed()).isEqualTo(3);
        assertThat(result.regressionSlope()).isPositive();
    }

    @Test
    @DisplayName("Downward trending data should produce DOWNWARD trend and negative slope")
    void forecastNextMonth_withDownwardTrend_shouldReturnDownwardTrend() {
        List<SalesTransaction> transactions = List.of(
            buildTransaction("2024-01-10", 90_000),
            buildTransaction("2024-02-15", 70_000),
            buildTransaction("2024-03-20", 50_000),
            buildTransaction("2024-04-05", 30_000)
        );
        given(repository.findAllByOrderByTransactionDateAsc()).willReturn(transactions);

        ForecastResponse result = forecastService.forecastNextMonth();

        assertThat(result.trend()).isEqualTo("DOWNWARD");
        assertThat(result.regressionSlope()).isNegative();
        assertThat(result.predictedRevenue()).isGreaterThanOrEqualTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Fewer than 2 data points should throw IllegalStateException")
    void forecastNextMonth_withInsufficientData_shouldThrowException() {
        List<SalesTransaction> singleTransaction = List.of(
            buildTransaction("2024-01-01", 50_000)
        );
        given(repository.findAllByOrderByTransactionDateAsc()).willReturn(singleTransaction);

        assertThatThrownBy(() -> forecastService.forecastNextMonth())
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("Insufficient data");
    }

    @Test
    @DisplayName("Multiple transactions in same month should aggregate before regression")
    void forecastNextMonth_withMultipleTransactionsPerMonth_shouldAggregateByMonth() {
        // Two transactions in January, one in February, one in March
        List<SalesTransaction> transactions = List.of(
            buildTransaction("2024-01-05", 15_000),
            buildTransaction("2024-01-20", 15_000),  // Jan total = 30k
            buildTransaction("2024-02-14", 40_000),  // Feb total = 40k
            buildTransaction("2024-03-10", 50_000)   // Mar total = 50k
        );
        given(repository.findAllByOrderByTransactionDateAsc()).willReturn(transactions);

        ForecastResponse result = forecastService.forecastNextMonth();

        // 3 distinct months aggregated, trend should be upward
        assertThat(result.dataPointsUsed()).isEqualTo(3);
        assertThat(result.trend()).isEqualTo("UPWARD");
    }

    // --- Helper ---

    private SalesTransaction buildTransaction(String date, double revenueAmount) {
        SalesTransaction tx = new SalesTransaction();
        tx.setTransactionDate(LocalDate.parse(date));
        tx.setRevenue(BigDecimal.valueOf(revenueAmount));
        tx.setCustomerSegment("Enterprise");
        tx.setRegion("North America");
        return tx;
    }
}
