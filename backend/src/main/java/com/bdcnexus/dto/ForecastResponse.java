package com.bdcnexus.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

/**
 * Data Transfer Object for the predictive revenue forecast response.
 * Uses a Java Record for clean, immutable DTO semantics (Java 16+).
 */
@Schema(description = "Predictive revenue forecast result from linear regression analysis")
public record ForecastResponse(

    @Schema(description = "Predicted revenue for next month in USD", example = "98500.00")
    BigDecimal predictedRevenue,

    @Schema(description = "Detected revenue trend direction", example = "UPWARD",
            allowableValues = {"UPWARD", "DOWNWARD"})
    String trend,

    @Schema(description = "Number of monthly data points used in the regression model", example = "12")
    int dataPointsUsed,

    @Schema(description = "Calculated slope of the regression line (revenue change per month)", example = "4250.50")
    double regressionSlope

) {}
