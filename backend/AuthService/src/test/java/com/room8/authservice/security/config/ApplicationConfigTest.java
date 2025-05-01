package com.room8.authservice.security.config;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ApplicationConfigTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void passwordEncoderBean_shouldBeAvailableAndWorking() {
        // Check that the bean is not null
        assertThat(passwordEncoder).isNotNull();

        // Check encoding behavior
        String rawPassword = "mySecret123";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        assertThat(encodedPassword).isNotEqualTo(rawPassword); // should be encoded
        assertThat(passwordEncoder.matches(rawPassword, encodedPassword)).isTrue(); // should match
    }
}