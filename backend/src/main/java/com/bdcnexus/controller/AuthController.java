package com.bdcnexus.controller;

import com.bdcnexus.config.JwtUtil;
import com.bdcnexus.dto.AuthRequest;
import com.bdcnexus.dto.AuthResponse;
import com.bdcnexus.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication endpoints:
 *   POST /auth/register — create account, returns JWT
 *   POST /auth/login    — validate credentials, returns JWT
 *
 * Include the returned token as: Authorization: Bearer <token>
 * on any write request (POST/PUT/DELETE /api/transactions).
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Register and obtain JWT tokens")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user and receive a JWT token")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        userService.register(request.username(), request.password());
        String token = jwtUtil.generateToken(request.username());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate with username/password and receive a JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        String token = jwtUtil.generateToken(auth.getName());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
