package com.bdcnexus.controller;

import com.bdcnexus.dto.ForecastResponse;
import com.bdcnexus.model.SalesTransaction;
import com.bdcnexus.repository.SalesTransactionRepository;
import com.bdcnexus.service.AnalyticsService;
import com.bdcnexus.service.ForecastService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * REST Controller — exposes all BDC-Nexus API endpoints.
 *
 * Endpoint groups:
 *   /api/transactions  — CRUD for sales transaction data ingestion
 *   /api/analytics     — aggregated revenue and predictive forecasting
 *
 * Swagger UI available at: http://localhost:8080/swagger-ui.html
 */
@RestController
@RequestMapping("/api")
@Tag(name = "BDC-Nexus API", description = "Sales transaction data ingestion, analytics, and predictive forecasting")
public class TransactionController {

    private final SalesTransactionRepository repository;
    private final AnalyticsService analyticsService;
    private final ForecastService forecastService;

    public TransactionController(SalesTransactionRepository repository,
                                 AnalyticsService analyticsService,
                                 ForecastService forecastService) {
        this.repository = repository;
        this.analyticsService = analyticsService;
        this.forecastService = forecastService;
    }

    // =====================================================================
    // Transaction CRUD — Data Ingestion API
    // =====================================================================

    @GetMapping("/transactions")
    @Operation(summary = "Get all transactions",
               description = "Retrieves the complete list of sales transactions ordered by ID")
    @ApiResponse(responseCode = "200", description = "Transaction list returned successfully")
    public List<SalesTransaction> getAllTransactions() {
        return repository.findAll();
    }

    @GetMapping("/transactions/{id}")
    @Operation(summary = "Get transaction by ID",
               description = "Retrieves a single sales transaction by its unique identifier")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Transaction found"),
        @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    public ResponseEntity<SalesTransaction> getTransactionById(
            @Parameter(description = "Transaction ID", example = "1")
            @PathVariable Long id) {
        return repository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/transactions")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new transaction",
               description = "Ingests a new sales transaction record into the analytics engine")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Transaction created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request body — validation failed")
    })
    public SalesTransaction createTransaction(@Valid @RequestBody SalesTransaction transaction) {
        return repository.save(transaction);
    }

    @PutMapping("/transactions/{id}")
    @Operation(summary = "Update an existing transaction",
               description = "Replaces all fields of an existing transaction with the provided data")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Transaction updated successfully"),
        @ApiResponse(responseCode = "404", description = "Transaction not found"),
        @ApiResponse(responseCode = "400", description = "Invalid request body — validation failed")
    })
    public ResponseEntity<SalesTransaction> updateTransaction(
            @Parameter(description = "Transaction ID to update", example = "1")
            @PathVariable Long id,
            @Valid @RequestBody SalesTransaction transaction) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        transaction.setId(id);
        return ResponseEntity.ok(repository.save(transaction));
    }

    @DeleteMapping("/transactions/{id}")
    @Operation(summary = "Delete a transaction",
               description = "Permanently removes a sales transaction from the system")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Transaction deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    public ResponseEntity<Void> deleteTransaction(
            @Parameter(description = "Transaction ID to delete", example = "1")
            @PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // =====================================================================
    // Analytics Endpoints
    // =====================================================================

    @GetMapping("/analytics/revenue-by-region")
    @Operation(summary = "Get total revenue by region",
               description = "Aggregates and returns total revenue grouped by geographic region. " +
                             "Powers the regional revenue bar chart on the analytics dashboard.")
    @ApiResponse(responseCode = "200", description = "Regional revenue map returned successfully")
    public Map<String, BigDecimal> getRevenueByRegion() {
        return analyticsService.getTotalRevenueByRegion();
    }

    @GetMapping("/analytics/forecast")
    @Operation(summary = "Get next-month revenue forecast",
               description = "Runs an Ordinary Least Squares (OLS) linear regression on monthly " +
                             "historical revenue data to predict next month's total revenue.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Forecast generated successfully"),
        @ApiResponse(responseCode = "500", description = "Insufficient data for regression model")
    })
    public ForecastResponse getRevenueForecast() {
        return forecastService.forecastNextMonth();
    }
}
