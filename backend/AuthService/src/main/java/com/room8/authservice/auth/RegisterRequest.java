package com.room8.authservice.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class RegisterRequest {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank @Email
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    @Pattern(
            regexp = "\\+237\\d{9}",
            message = "Phone number must be in the format +237XXXXXXXXX"
    )
    private String phoneNumber;
    private String otp;

}
