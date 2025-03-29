package com.gethealthy.apigateway.security.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            String ip = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
            System.out.println("Resolved IP: " + ip); // Debug logging
            return Mono.just(ip);
        };
    }

    // Other custom key resolvers can be defined here
}
