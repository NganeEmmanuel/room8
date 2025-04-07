package com.room8.contactservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    @Bean
    public JavaMailSender mailSender() {
        return new JavaMailSenderImpl();
    }
}
