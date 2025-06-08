package com.room8.roomservice.service.impl;

import com.room8.roomservice.dto.*;
import com.room8.roomservice.exception.InvalidRoomTypeException;
import com.room8.roomservice.exception.NotFoundException;
import com.room8.roomservice.repository.ApartmentRepository;
import com.room8.roomservice.repository.SingleRoomRepository;
import com.room8.roomservice.repository.StudioRepository;
import com.room8.roomservice.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final SingleRoomMapper singleRoomMapper;
    private final StudioMapper studioMapper;
    private final ApartmentMapper apartmentMapper;
    private final SingleRoomRepository singleRoomRepository;
    private final StudioRepository studioRepository;
    private final ApartmentRepository apartmentRepository;


    @Override
    public ListingDTO addRoom(ListingDTO listingDTO) throws NotFoundException {
        return switch (listingDTO.getListingType()) {
            case "SingleRoom" -> singleRoomMapper.toDTO(
                    singleRoomRepository.save(
                            singleRoomMapper.toEntity((SingleRoomDTO) listingDTO)
                    )
            );
            case "Studio" -> studioMapper.toDTO(
                    studioRepository.save(
                            studioMapper.toEntity((StudioDTO) listingDTO)
                    )
            );
            case "Apartment" -> apartmentMapper.toDTO(
                    apartmentRepository.save(
                            apartmentMapper.toEntity((ApartmentDTO) listingDTO)
                    )
            );
            default -> throw new InvalidRoomTypeException("Invalid room type. Select one of the available room types: SingleRoom, Studio, Apartment");
        };
    }

    @Override
    public ListingDTO getRoom(ListingRequest listingRequest) throws NotFoundException, InvalidRoomTypeException {
        return switch (listingRequest.getListingType()){
            case "SingleRoom" -> singleRoomMapper.toDTO(
                    singleRoomRepository.findById(listingRequest.getRoomId()).orElseThrow(
                            () -> new NotFoundException("Invalid room id: " + listingRequest.getRoomId())
                    )
            );
            case "Studio" -> studioMapper.toDTO(
                    studioRepository.findById(listingRequest.getRoomId()).orElseThrow(
                            () -> new NotFoundException("Invalid room id: " + listingRequest.getRoomId())
                    )
            );
            case "Apartment" -> apartmentMapper.toDTO(
                    apartmentRepository.findById(listingRequest.getRoomId()).orElseThrow(
                            () -> new NotFoundException("Invalid room id: " + listingRequest.getRoomId())
                    )
            );
            default -> throw new InvalidRoomTypeException("Invalid room type. Select one of the available room types: SingleRoom, Studio, Apartment");
        };
    }

    @Override
    public ListingDTO updateRoom(ListingDTO listingDTO) throws NotFoundException {
        return null;
    }

    @Override
    public void deleteRoom(ListingRequest listingRequest) throws NotFoundException, InvalidRoomTypeException {
        switch (listingRequest.getListingType()) {
            case "SingleRoom" -> {
                singleRoomRepository.findById(listingRequest.getRoomId())
                        .orElseThrow(
                                () -> new NotFoundException("Invalid room id: " + listingRequest.getRoomId())
                        );
                singleRoomRepository.deleteById(listingRequest.getRoomId());
            }
            case "Studio" -> {
                studioRepository.findById(listingRequest.getRoomId())
                        .orElseThrow(
                                () -> new NotFoundException("Invalid room id: " + listingRequest.getRoomId())
                        );
                studioRepository.deleteById(listingRequest.getRoomId());
            }
            case "Apartment" -> {
                apartmentRepository.findById(listingRequest.getRoomId())
                        .orElseThrow(
                                () -> new NotFoundException("Invalid room id: " + listingRequest.getRoomId())
                        );
                apartmentRepository.deleteById(listingRequest.getRoomId());
            }
            default -> throw new InvalidRoomTypeException("Invalid room type. Select one of the available room types: SingleRoom, Studio, Apartment");
        }

    }


    @Override
    public void deleteAllRoomsByUserID(Long userId) throws NotFoundException {
        singleRoomRepository.deleteByLandlordId(userId);
        studioRepository.deleteByLandlordId(userId);
        apartmentRepository.deleteByLandlordId(userId);
    }
}
