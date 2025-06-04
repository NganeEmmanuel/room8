package com.room8.authservice.exception.errordecoder;

import com.room8.authservice.exception.ExternalServiceException;
import com.room8.authservice.exception.UserNotFoundException;
import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class CustomErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        String message = "Unknown error";

        // Try to extract response body (error message)
        if (response.body() != null) {
            try {
                message = new String(response.body().asInputStream().readAllBytes(), StandardCharsets.UTF_8);
            } catch (IOException e) {
                message = "Failed to read error response";
            }
        }

        // Custom handling based on status
        if (response.status() == HttpStatus.NOT_FOUND.value()) {
            return new UserNotFoundException(message);
        } else if (response.status() >= 400 && response.status() < 500) {
            return new ExternalServiceException(message); // You now get the real message
        }

        return defaultDecoder.decode(methodKey, response);
    }
}
