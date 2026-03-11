package com.bdcnexus.service;

import com.bdcnexus.repository.SalesTransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Analytics Service — computes aggregated business metrics from sales data.
 *
 * Sprint 1 deliverable: provides the regional revenue aggregation
 * that powers the dashboard bar chart on the frontend.
 */
@Service
public class AnalyticsService {

    private final SalesTransactionRepository repository;

    public AnalyticsService(SalesTransactionRepository repository) {
        this.repository = repository;
    }

    /**
     * Computes total revenue for each geographic region.
     *
     * Uses a JPQL GROUP BY query on the SalesTransaction entity
     * for efficient server-side aggregation rather than in-memory summing.
     *
     * @return map of region name → total revenue, ordered alphabetically by region
     */
    public Map<String, BigDecimal> getTotalRevenueByRegion() {
        List<Object[]> rows = repository.sumRevenueByRegion();

        // LinkedHashMap preserves the alphabetical ordering from the JPQL ORDER BY clause
        Map<String, BigDecimal> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String region = (String) row[0];
            BigDecimal totalRevenue = (BigDecimal) row[1];
            result.put(region, totalRevenue);
        }
        return result;
    }
}
