package com.bdcnexus.controller;

import com.bdcnexus.dto.ForecastResponse;
import com.bdcnexus.model.SalesTransaction;
import com.bdcnexus.repository.SalesTransactionRepository;
import com.bdcnexus.service.AnalyticsService;
import com.bdcnexus.service.ForecastService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * JUnit Test 1: TransactionController — Web Layer Slice Test
 *
 * Uses @WebMvcTest to load only the MVC web layer (no full Spring context,
 * no database). Dependencies are mocked with @MockBean.
 *
 * Tests:
 *   - GET /api/transactions returns HTTP 200 with JSON content type
 *   - POST /api/transactions with valid body returns HTTP 201
 *   - GET /api/analytics/revenue-by-region returns aggregated map
 */
@WebMvcTest(TransactionController.class)
@DisplayName("TransactionController Web Layer Tests")
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SalesTransactionRepository repository;

    @MockBean
    private AnalyticsService analyticsService;

    @MockBean
    private ForecastService forecastService;

    // SecurityConfig requires these beans — mock them so the web slice loads cleanly
    @MockBean
    private com.bdcnexus.config.JwtAuthFilter jwtAuthFilter;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private com.bdcnexus.config.JwtUtil jwtUtil;

    @Test
    @DisplayName("GET /api/transactions should return 200 OK with JSON content type")
    void getAllTransactions_shouldReturn200WithJsonContentType() throws Exception {
        SalesTransaction tx = new SalesTransaction(
            LocalDate.of(2024, 6, 15),
            new BigDecimal("45200.00"),
            "Enterprise",
            "North America"
        );
        given(repository.findAll()).willReturn(List.of(tx));

        mockMvc.perform(get("/api/transactions"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/transactions with valid body should return 201 Created")
    void createTransaction_withValidBody_shouldReturn201() throws Exception {
        SalesTransaction tx = new SalesTransaction(
            LocalDate.of(2024, 8, 20),
            new BigDecimal("32500.00"),
            "SMB",
            "Europe"
        );
        given(repository.save(any(SalesTransaction.class))).willReturn(tx);

        mockMvc.perform(post("/api/transactions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tx)))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("GET /api/analytics/revenue-by-region should return revenue map")
    void getRevenueByRegion_shouldReturnMapWithRegions() throws Exception {
        Map<String, BigDecimal> revenueMap = Map.of(
            "North America", new BigDecimal("350000.00"),
            "Europe",        new BigDecimal("175000.00")
        );
        given(analyticsService.getTotalRevenueByRegion()).willReturn(revenueMap);

        mockMvc.perform(get("/api/analytics/revenue-by-region"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$['North America']").value(350000.00));
    }

    @Test
    @DisplayName("GET /api/transactions/{id} with unknown ID should return 404")
    void getTransactionById_withUnknownId_shouldReturn404() throws Exception {
        given(repository.findById(999L)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/transactions/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/analytics/forecast should return forecast response")
    void getForecast_shouldReturnForecastResponse() throws Exception {
        ForecastResponse forecast = new ForecastResponse(
            new BigDecimal("98500.00"), "UPWARD", 12, 4250.50
        );
        given(forecastService.forecastNextMonth()).willReturn(forecast);

        mockMvc.perform(get("/api/analytics/forecast"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.trend").value("UPWARD"))
            .andExpect(jsonPath("$.dataPointsUsed").value(12));
    }
}
