package com.userauth.user_auth.security.filter;

import com.userauth.user_auth.UserAuthApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = UserAuthApplication.class)
@ActiveProfiles("test") // Optional: if you have a 'test' profile
public class SecurityConfigTest {

    @Test
    void contextLoads() {
        // This is a basic test to ensure the Spring context loads successfully.
    }
}
