package com.room8.searchservice.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.apache.http.Header;
import org.apache.http.message.BasicHeader;

import java.net.URI;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class ElasticsearchConfig {

    @Value("${spring.elasticsearch.uris}")
    private String elasticsearchUrl;

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        try {
            URI uri = new URI(elasticsearchUrl);
            HttpHost httpHost = new HttpHost(uri.getHost(), uri.getPort(), uri.getScheme());

            RestClient restClient = RestClient.builder(httpHost)
                    .setDefaultHeaders(new Header[]{
                            new BasicHeader("Content-Type", "application/json"),
                            new BasicHeader("Accept", "application/json")
                    })
                    .build();

            RestClientTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());

            return new ElasticsearchClient(transport);
        } catch (Exception e) {
            log.error("Failed to create ElasticsearchClient", e);
            throw new RuntimeException(e);
        }
    }

}
