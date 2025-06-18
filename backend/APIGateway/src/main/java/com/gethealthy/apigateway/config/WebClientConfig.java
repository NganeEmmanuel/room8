package com.gethealthy.apigateway.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

//    @Bean
//    @Profile("prod")
//    @LoadBalanced
//    public WebClient.Builder loadBalancedWebClientBuilder() {
//        return WebClient.builder();
//    }
//
//    @Bean
//    @Profile("prod")
//    public WebClient loadBalancedWebClient(WebClient.Builder loadBalancedWebClientBuilder) {
//        return loadBalancedWebClientBuilder.build();
//    }

    @Bean
    @Profile("dev")
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}


