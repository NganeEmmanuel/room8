package com.room8.roomservice.controller;

import com.room8.roomservice.dto.GetListingRequest;
import com.room8.roomservice.dto.ListingDTO;
import com.room8.roomservice.dto.ListingRequest;
import com.room8.roomservice.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/v1/listings")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public ListingDTO addRoom(@RequestBody ListingDTO listingDTO) {
        return roomService.addRoom(listingDTO);
    }

    @GetMapping("/get/listing")
    @ResponseStatus(HttpStatus.OK)
    public ListingDTO getRoom(@RequestBody ListingRequest listingRequest) {
        return roomService.getRoom(listingRequest);
    }

    @PostMapping("/get/listings")
    @ResponseStatus(HttpStatus.OK)
    public List<ListingDTO> getRooms(@RequestBody GetListingRequest listingRequest) {
        return roomService.getRooms(listingRequest);
    }

    @PutMapping("/update/listing")
    @ResponseStatus(HttpStatus.OK)
    public ListingDTO updateRoom(@RequestBody ListingDTO listingDTO) {
        return roomService.updateRoom(listingDTO);
    }

    @DeleteMapping("/delete/listing")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public String deleteRoom(@Valid @RequestBody ListingRequest listingRequest) {
        roomService.deleteRoom(listingRequest);
        return "Deleted";
    }


    @DeleteMapping("/delete-all-by-userId")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public String deleteAllRoomsByUserID(@RequestParam Long userID) {
        roomService.deleteAllRoomsByUserID(userID);
        return "Deleted";
    }
}
