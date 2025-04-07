package com.room8.contactservice.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendSMSCodeRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Phone number is required")
    private String code;
}
