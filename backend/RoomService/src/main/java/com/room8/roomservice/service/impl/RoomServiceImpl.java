package com.room8.roomservice.service.impl;

import com.room8.roomservice.dto.*;
import com.room8.roomservice.exception.InvalidRoomTypeException;
import com.room8.roomservice.exception.NotFoundException;
import com.room8.roomservice.messaging.ListingEventPublisher;
import com.room8.roomservice.repository.ApartmentRepository;
import com.room8.roomservice.repository.SingleRoomRepository;
import com.room8.roomservice.repository.StudioRepository;
import com.room8.roomservice.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final SingleRoomMapper singleRoomMapper;
    private final StudioMapper studioMapper;
    private final ApartmentMapper apartmentMapper;
    private final SingleRoomRepository singleRoomRepository;
    private final StudioRepository studioRepository;
    private final ApartmentRepository apartmentRepository;
    private final ListingEventPublisher listingEventPublisher;


    @Override
    public ListingDTO addRoom(ListingDTO listingDTO) throws NotFoundException {
        ListingDTO saved = saveRoom(listingDTO);
        // trigger a creation even in kafka
        listingEventPublisher.publishListingEvent(saved, "CREATE");
        return saved;
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
        // check if room exist
        findListingById(listingDTO.getId(), listingDTO.getListingType());
        //save room if it does
        ListingDTO updated = saveRoom(listingDTO);
        // trigger an updating Kafka
        listingEventPublisher.publishListingEvent(updated, "UPDATE");
        return updated;
    }

    @Override
    public void deleteRoom(ListingRequest listingRequest) throws NotFoundException, InvalidRoomTypeException {
        // Optional: send a deletion event if you want the search index to delete it too
        ListingDTO listingToDelete = getRoom(listingRequest); // reuse method
        // delete the room
        switch (listingRequest.getListingType()) {
            case "SingleRoom" -> singleRoomRepository.deleteById(listingRequest.getRoomId());
            case "Studio" -> studioRepository.deleteById(listingRequest.getRoomId());
            case "Apartment" -> apartmentRepository.deleteById(listingRequest.getRoomId());
        }
        // send deleted event in kafka
        listingEventPublisher.publishListingEvent(listingToDelete, "DELETE");

    }


    @Override
    public void deleteAllRoomsByUserID(Long userId) throws NotFoundException {
        singleRoomRepository.deleteByLandlordId(userId);
        studioRepository.deleteByLandlordId(userId);
        apartmentRepository.deleteByLandlordId(userId);
    }

    private void findListingById(Long listingId, String listinType) throws NotFoundException {
        switch (listinType){
            case "SingleRoom" -> singleRoomRepository.findById(listingId).orElseThrow(
                    () -> new NotFoundException("Invalid room id: " + listingId)
            );
            case "Studio" -> studioRepository.findById(listingId).orElseThrow(
                    () -> new NotFoundException("Invalid room id: " + listingId)
            );
            case "Apartment" -> apartmentRepository.findById(listingId).orElseThrow(
                    () -> new NotFoundException("Invalid room id: " + listingId)
            );
            default -> throw new InvalidRoomTypeException("Invalid room type. Select one of the available room types: SingleRoom, Studio, Apartment");
        }
    }

    private ListingDTO saveRoom(ListingDTO listingDTO){
        return switch (listingDTO.getListingType()){
            case "SingleRoom" -> singleRoomMapper.toDTO(
                        singleRoomRepository.save(singleRoomMapper.toEntity((SingleRoomDTO) listingDTO))
                );
            case "Studio" -> studioMapper.toDTO(
                    studioRepository.save(studioMapper.toEntity((StudioDTO) listingDTO))
            );
            case "Apartment" -> apartmentMapper.toDTO(
                    apartmentRepository.save(apartmentMapper.toEntity((ApartmentDTO) listingDTO))
            );
            default -> throw new InvalidRoomTypeException("Invalid room type. Select one of the available room types: SingleRoom, Studio, Apartment");
        };
    }
}
