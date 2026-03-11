package com.bdcnexus.service;

import com.bdcnexus.repository.SalesTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

/**
 * JUnit Test 2: AnalyticsService — Pure Unit Test (no Spring context)
 *
 * Uses plain Mockito (no @SpringBootTest) for fast, isolated testing
 * of the revenue aggregation business logic.
 *
 * Tests:
 *   - Regional revenue map is populated with correct values
 *   - Multiple regions are all included in the result
 *   - Null/empty result set returns empty map (not null)
 */
@DisplayName("AnalyticsService Unit Tests")
class AnalyticsServiceTest {

    private SalesTransactionRepository repository;
    private AnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
        repository = mock(SalesTransactionRepository.class);
        analyticsService = new AnalyticsService(repository);
    }

    @Test
    @DisplayName("getTotalRevenueByRegion should map regions to correct revenue totals")
    void getTotalRevenueByRegion_shouldReturnCorrectAggregates() {
        // Arrange: mock the JPQL query result as [region, totalRevenue] object arrays
        List<Object[]> mockRows = List.of(
            new Object[]{"Asia Pacific",  new BigDecimal("113700.00")},
            new Object[]{"Europe",        new BigDecimal("225400.00")},
            new Object[]{"Latin America", new BigDecimal("87600.00")},
            new Object[]{"North America", new BigDecimal("556100.00")}
        );
        given(repository.sumRevenueByRegion()).willReturn(mockRows);

        // Act
        Map<String, BigDecimal> result = analyticsService.getTotalRevenueByRegion();

        // Assert
        assertThat(result).hasSize(4);
        assertThat(result.get("North America"))
            .isEqualByComparingTo(new BigDecimal("556100.00"));
        assertThat(result.get("Europe"))
            .isEqualByComparingTo(new BigDecimal("225400.00"));
        assertThat(result.get("Asia Pacific"))
            .isEqualByComparingTo(new BigDecimal("113700.00"));
        assertThat(result.get("Latin America"))
            .isEqualByComparingTo(new BigDecimal("87600.00"));
    }

    @Test
    @DisplayName("getTotalRevenueByRegion with empty data should return empty map")
    void getTotalRevenueByRegion_withNoData_shouldReturnEmptyMap() {
        given(repository.sumRevenueByRegion()).willReturn(List.of());

        Map<String, BigDecimal> result = analyticsService.getTotalRevenueByRegion();

        assertThat(result).isNotNull().isEmpty();
    }

    @Test
    @DisplayName("getTotalRevenueByRegion should include all regions without omission")
    void getTotalRevenueByRegion_shouldIncludeAllRegions() {
        List<Object[]> mockRows = List.of(
            new Object[]{"Europe",        new BigDecimal("50000.00")},
            new Object[]{"North America", new BigDecimal("80000.00")}
        );
        given(repository.sumRevenueByRegion()).willReturn(mockRows);

        Map<String, BigDecimal> result = analyticsService.getTotalRevenueByRegion();

        assertThat(result).containsKeys("Europe", "North America");
        assertThat(result).doesNotContainKey("Asia Pacific");
    }
}
