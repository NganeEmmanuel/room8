package com.room8.authservice.utils;

import org.springframework.stereotype.Component;

@Component
public class CheckEndpoints {
    public static boolean isPublicEndpoint(String path) {
        return path.equals("/api/v1/auth/signup/tenant") ||
                path.equals("/api/v1/auth/login") ||
                path.equals("/api/v1/auth/authenticate") ||
                path.startsWith("/swagger") || // Optional: for Swagger UI access
                path.equals("/v3/api-docs");   // Optional: for OpenAPI access
    }

}
