package com.gethealthy.apigateway.security.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.http.server.reactive.ServerHttpResponse;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private WebClient loadBalancedWebClient; // Injected load-balanced WebClient

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String requestPath = exchange.getRequest().getURI().getPath();

            // Extract serviceId from path prefix
            String[] parts = requestPath.split("/", 3); // ["", "auth-service", "api/v1/auth/login"]
            if (parts.length < 3) {
                return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid path format"));
            }

            String serviceId = parts[1]; // "auth-service"
            String newPath = "/" + parts[2]; // "/api/v1/auth/login"
            String targetUri = "lb://" + serviceId + newPath;

            // Skip auth filter for these paths
            if (requestPath.equals("/auth-service/api/v1/auth/login")
                    || requestPath.equals("/auth-service/api/v1/auth/signup/tenant")
                    || requestPath.equals("/auth-service/api/v1/auth/signup/landlord")
//                    || requestPath.equals("/api/v1/auth/authenticate-user")
//                    || requestPath.equals("/auth-service/api/v1/auth/authenticate-user")
            ) {
                return exchange.getRequest().getBody()
                        .next()
                        .flatMap(dataBuffer -> loadBalancedWebClient
                                .method(exchange.getRequest().getMethod()) // Support POST/GET/etc.
                                .uri(targetUri)
                                .headers(headers -> headers.addAll(exchange.getRequest().getHeaders()))
                                .bodyValue(dataBuffer.asByteBuffer())
                                .retrieve()
                                .toEntity(String.class)
                                .flatMap(response -> {
                                    ServerHttpResponse clientResponse = exchange.getResponse();
                                    clientResponse.setStatusCode(response.getStatusCode());
                                    clientResponse.getHeaders().putAll(response.getHeaders());
                                    DataBuffer buffer = clientResponse.bufferFactory().wrap(response.getBody().getBytes(StandardCharsets.UTF_8));
                                    return clientResponse.writeWith(Mono.just(buffer));
                                })
                        );

            }

            // Check Authorization header presence
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return this.onError(exchange, "No Authorization header");
            }

            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return this.onError(exchange, "Invalid Authorization header");
            }

            return loadBalancedWebClient
                    .post()
                    .uri("lb://auth-service/api/v1/auth/authenticate-user")
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    // Handle 401 Unauthorized gracefully instead of throwing error
                    .onErrorResume(WebClientResponseException.Unauthorized.class, ex -> Mono.just(false))
                    // You can also handle other errors if needed:
                    //.onErrorResume(WebClientResponseException.class, ex -> {
                    //    // Log error if desired
                    //    return Mono.just(false);
                    //})
                    .flatMap(isAuthorized -> {
                        if (Boolean.TRUE.equals(isAuthorized)) {
                            return chain.filter(exchange);
                        } else {
                            return this.onError(exchange, "Unauthorized");
                        }
                    });
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        // You can optionally add a response body or headers here if needed
        return response.setComplete();
    }

    public static class Config {
        // Put configuration properties here if needed
    }
}
