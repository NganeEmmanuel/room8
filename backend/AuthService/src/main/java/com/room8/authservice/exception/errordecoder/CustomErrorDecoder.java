package com.room8.authservice.exception.errordecoder;

import com.room8.authservice.exception.UserNotFoundException;
import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.http.HttpStatus;

public class CustomErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        if (response.status() == HttpStatus.NOT_FOUND.value()) {
            return new UserNotFoundException("User not found");
        }
        return defaultDecoder.decode(methodKey, response);
    }
}