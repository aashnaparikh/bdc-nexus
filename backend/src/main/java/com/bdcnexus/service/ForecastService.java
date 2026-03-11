package com.bdcnexus.service;

import com.bdcnexus.dto.ForecastResponse;
import com.bdcnexus.model.SalesTransaction;
import com.bdcnexus.repository.SalesTransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Forecast Service — implements Ordinary Least Squares (OLS) linear regression
 * to predict next month's revenue based on historical monthly aggregates.
 *
 * Algorithm:
 *   Given n monthly data points (x_i = month index, y_i = monthly revenue):
 *     slope     = ( n * Σ(x*y) - Σx * Σy ) / ( n * Σ(x²) - (Σx)² )
 *     intercept = ( Σy - slope * Σx ) / n
 *     forecast  = intercept + slope * (n + 1)
 *
 * Sprint 2 deliverable: powers the "Next Month Forecast" panel on the dashboard.
 */
@Service
public class ForecastService {

    private static final int MINIMUM_DATA_POINTS = 2;

    private final SalesTransactionRepository repository;

    public ForecastService(SalesTransactionRepository repository) {
        this.repository = repository;
    }

    /**
     * Generates a revenue forecast for the next calendar month.
     *
     * @return ForecastResponse containing predicted revenue, trend direction,
     *         number of data points used, and regression slope
     * @throws IllegalStateException if fewer than 2 monthly data points exist
     */
    public ForecastResponse forecastNextMonth() {
        List<SalesTransaction> allTransactions = repository.findAllByOrderByTransactionDateAsc();

        // Step 1: Aggregate daily transactions into monthly revenue totals
        // TreeMap ensures keys are sorted chronologically (YYYY-MM lexicographic order works for ISO dates)
        Map<String, BigDecimal> monthlyRevenue = new TreeMap<>();
        for (SalesTransaction tx : allTransactions) {
            String monthKey = String.format("%04d-%02d",
                tx.getTransactionDate().getYear(),
                tx.getTransactionDate().getMonthValue());
            monthlyRevenue.merge(monthKey, tx.getRevenue(), BigDecimal::add);
        }

        int n = monthlyRevenue.size();
        if (n < MINIMUM_DATA_POINTS) {
            throw new IllegalStateException(
                "Insufficient data for forecast: need at least " + MINIMUM_DATA_POINTS +
                " months of data, but found " + n);
        }

        // Step 2: Convert to indexed arrays for regression computation
        // x[i] = month index (1-based), y[i] = total revenue for that month
        double[] x = new double[n];
        double[] y = new double[n];

        int i = 0;
        for (BigDecimal monthTotal : monthlyRevenue.values()) {
            x[i] = i + 1;
            y[i] = monthTotal.doubleValue();
            i++;
        }

        // Step 3: Compute OLS regression coefficients
        double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (int j = 0; j < n; j++) {
            sumX  += x[j];
            sumY  += y[j];
            sumXY += x[j] * y[j];
            sumX2 += x[j] * x[j];
        }

        double denominator = (n * sumX2) - (sumX * sumX);
        double slope     = (denominator != 0) ? ((n * sumXY) - (sumX * sumY)) / denominator : 0;
        double intercept = (sumY - slope * sumX) / n;

        // Step 4: Predict revenue for the next month (index = n + 1)
        double rawPrediction = intercept + slope * (n + 1);

        // Floor at zero — revenue cannot be negative
        double predicted = Math.max(rawPrediction, 0.0);

        BigDecimal predictedRevenue = BigDecimal.valueOf(predicted)
            .setScale(2, RoundingMode.HALF_UP);

        String trend = slope >= 0 ? "UPWARD" : "DOWNWARD";

        double roundedSlope = BigDecimal.valueOf(slope)
            .setScale(2, RoundingMode.HALF_UP)
            .doubleValue();

        return new ForecastResponse(predictedRevenue, trend, n, roundedSlope);
    }
}
