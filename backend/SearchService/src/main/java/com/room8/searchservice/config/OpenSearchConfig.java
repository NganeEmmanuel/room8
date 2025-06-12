package com.room8.searchservice.config;

import org.apache.http.HttpHost;
import org.opensearch.client.RestHighLevelClient;
import org.opensearch.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;

@Configuration
public class OpenSearchConfig {

    @Value("${spring.elasticsearch.uris}")
    private String opensearchUrl;

    @Bean(destroyMethod = "close")
    public RestHighLevelClient openSearchClient() throws Exception {
        URI uri = new URI(opensearchUrl);
        HttpHost host = new HttpHost(uri.getHost(), uri.getPort(), uri.getScheme());
        return new RestHighLevelClient(RestClient.builder(host));
    }
}
