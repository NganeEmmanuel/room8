package com.gethealthy.apigateway.security.filter;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.http.server.reactive.ServerHttpResponse;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

//    @Autowired
    @Autowired
    private WebClient webClient;  // plain WebClient
//    private WebClient loadBalancedWebClient; // Injected load-balanced WebClient

    @Value("${auth-service.url}")
    private String authServiceUrl;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String requestPath = exchange.getRequest().getURI().getPath();

            // Skip auth filter for these paths
            if (requestPath.equals("/auth-service/api/v1/auth/login")
                    || requestPath.equals("/auth-service/api/v1/auth/signup/tenant")
                    || requestPath.equals("/auth-service/api/v1/auth/signup/landlord")
                    || requestPath.equals("/api/v1/auth/refresh-token")
                    || requestPath.equals("/search-service/api/v1/search")
                    || requestPath.equals("/search-service/api/v1/search/filter")
            ) {
                return chain.filter(exchange);
            }

            // Check Authorization header presence
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return this.onError(exchange, "No Authorization header");
            }

            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return this.onError(exchange, "Invalid Authorization header");
            }

            return webClient
                    .post()
                    .uri(authServiceUrl + "/api/v1/auth/authenticate-user")
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
