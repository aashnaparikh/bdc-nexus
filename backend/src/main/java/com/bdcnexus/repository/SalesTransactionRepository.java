package com.bdcnexus.repository;

import com.bdcnexus.model.SalesTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Data access layer for SalesTransaction entities.
 * Extends JpaRepository for standard CRUD operations.
 * Custom JPQL queries support the analytics and forecasting services.
 */
@Repository
public interface SalesTransactionRepository extends JpaRepository<SalesTransaction, Long> {

    /**
     * Aggregates total revenue grouped by region.
     * Used by AnalyticsService to compute regional revenue summaries.
     *
     * @return list of [region, totalRevenue] object arrays
     */
    @Query("SELECT t.region, SUM(t.revenue) FROM SalesTransaction t GROUP BY t.region ORDER BY t.region")
    List<Object[]> sumRevenueByRegion();

    /**
     * Returns all transactions sorted by date ascending.
     * Used by ForecastService to build the time-series for linear regression.
     *
     * @return transactions ordered oldest to newest
     */
    List<SalesTransaction> findAllByOrderByTransactionDateAsc();
}
