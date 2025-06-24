package com.room8.bidservice.client;

import com.room8.bidservice.model.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@FeignClient(
        name = "${user-service.name}",
        url = "${user-service.url}"
)
public interface UserAuthServiceInterface {
    @GetMapping("/api/v1/user/get-user/id")
    ResponseEntity<UserDTO> getUserFromId(@RequestParam Long id);
}
