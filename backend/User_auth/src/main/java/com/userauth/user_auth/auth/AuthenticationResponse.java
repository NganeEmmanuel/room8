package com.userauth.user_auth.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.jackson.JsonComponent;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonComponent
public class AuthenticationResponse {
    private String token;
    private String refreshToken;
}
