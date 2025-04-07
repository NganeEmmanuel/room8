package com.room8.contactservice.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

/**
 * Represents a request to send a verification email.
 */
@Data
@Builder
public class VerificationRequest {

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email should be valid")
    private String email;
}
