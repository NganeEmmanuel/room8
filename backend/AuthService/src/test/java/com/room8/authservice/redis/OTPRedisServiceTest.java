package com.room8.authservice.redis;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link OTPRedisService} class.
 */
@ExtendWith(MockitoExtension.class)
class OTPRedisServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private OTPRedisService otpRedisService;

    private String phoneNumber;
    private String otp;
    private long expirationInMinutes;

    @BeforeEach
    void setUp() {
        phoneNumber = "1234567890";
        otp = "123456";
        expirationInMinutes = 5;

        // Mock redisTemplate.opsForValue() to return the mocked ValueOperations instance
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testStoreOTP() {
        // Act
        otpRedisService.storeOTP(phoneNumber, otp, expirationInMinutes);

        // Assert
        verify(valueOperations).set(
                "auth:phoneNumber:" + phoneNumber, otp, expirationInMinutes, TimeUnit.MINUTES);
    }

    @Test
    void testGetOTP() {
        // Arrange
        when(valueOperations.get("auth:phoneNumber:" + phoneNumber)).thenReturn(otp);

        // Act
        String retrievedOtp = otpRedisService.getOTP(phoneNumber);

        // Assert
        assertEquals(otp, retrievedOtp);
    }

    @Test
    void testGetOTP_notFound() {
        // Arrange
        when(valueOperations.get("auth:phoneNumber:" + phoneNumber)).thenReturn(null);

        // Act
        String retrievedOtp = otpRedisService.getOTP(phoneNumber);

        // Assert
        assertNull(retrievedOtp); // Assert that null is returned if OTP is not found
    }

    @Test
    void testInvalidateOTP() {
        // Act
        otpRedisService.invalidateOTP(phoneNumber);

        // Assert
        verify(redisTemplate).delete("auth:phoneNumber:" + phoneNumber);
    }

    @Test
    void testStoreOTP_nullPhoneNumber() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                otpRedisService.storeOTP(null, otp, expirationInMinutes)
        );
    }

    @Test
    void testStoreOTP_nullOtp() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                otpRedisService.storeOTP(phoneNumber, null, expirationInMinutes)
        );
    }

    @Test
    void testStoreOTP_zeroExpiration() {
        // Assert
        assertThrows(IllegalArgumentException.class, () ->
                otpRedisService.storeOTP(phoneNumber, otp, 0)
        );
    }

    @Test
    void testStoreOTP_negativeExpiration() {
        // Assert
        assertThrows(IllegalArgumentException.class, () ->
                otpRedisService.storeOTP(phoneNumber, otp, -1)
        );
    }

    @Test
    void testInvalidateOTP_nullPhoneNumber() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                otpRedisService.invalidateOTP(null)
        );
    }

    @Test
    void testGetOTP_nullPhoneNumber() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                otpRedisService.getOTP(null)
        );
    }
}