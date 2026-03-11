package com.bdcnexus.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Core entity representing a single sales transaction.
 * Maps to the 'sales_transactions' table in PostgreSQL.
 */
@Entity
@Table(name = "sales_transactions")
@Schema(description = "A sales transaction record used for analytics and forecasting")
public class SalesTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(name = "transaction_date", nullable = false)
    @NotNull(message = "Transaction date is required")
    @Schema(description = "Date of the transaction", example = "2024-06-15")
    private LocalDate transactionDate;

    @Column(nullable = false, precision = 15, scale = 2)
    @NotNull(message = "Revenue is required")
    @Positive(message = "Revenue must be a positive value")
    @Schema(description = "Transaction revenue in USD", example = "45200.00")
    private BigDecimal revenue;

    @Column(name = "customer_segment", nullable = false, length = 100)
    @NotBlank(message = "Customer segment is required")
    @Schema(description = "Customer segment classification", example = "Enterprise",
            allowableValues = {"Enterprise", "Mid-Market", "SMB"})
    private String customerSegment;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Region is required")
    @Schema(description = "Geographic region of the sale", example = "North America",
            allowableValues = {"North America", "Europe", "Asia Pacific", "Latin America"})
    private String region;

    // --- Constructors ---

    public SalesTransaction() {}

    public SalesTransaction(LocalDate transactionDate, BigDecimal revenue,
                            String customerSegment, String region) {
        this.transactionDate = transactionDate;
        this.revenue = revenue;
        this.customerSegment = customerSegment;
        this.region = region;
    }

    // --- Getters & Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public String getCustomerSegment() { return customerSegment; }
    public void setCustomerSegment(String customerSegment) { this.customerSegment = customerSegment; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
}
