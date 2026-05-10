package com.angelo.careerflow.auth;

public record AuthResponse(
        String token,
        String tokenType,
        long expiresInMinutes
) {
}