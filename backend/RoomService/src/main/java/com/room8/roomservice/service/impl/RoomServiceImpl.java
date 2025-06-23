package com.room8.roomservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.roomservice.dto.*;
import com.room8.roomservice.exception.InvalidRequestException;
import com.room8.roomservice.exception.NotFoundException;
import com.room8.roomservice.messaging.ListingEventPublisher;
import com.room8.roomservice.repository.ApartmentRepository;
import com.room8.roomservice.repository.SingleRoomRepository;
import com.room8.roomservice.repository.StudioRepository;
import com.room8.roomservice.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;


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
    public ListingDTO getRoom(ListingRequest listingRequest) throws NotFoundException, InvalidRequestException {
        if (listingRequest == null){
            throw new InvalidRequestException("Listing request cannot be null");
        } else if(
                listingRequest.getRoomId() == null
                || Objects.equals(listingRequest.getListingType(), "") || listingRequest.getListingType() == null
        ) {
                throw new InvalidRequestException("Room id and listingType cannot be null");
        }
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
            default -> throw new InvalidRequestException("Invalid room type. Select one of the available room types: SingleRoom, Studio, Apartment");
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
    public void deleteRoom(ListingRequest listingRequest) throws NotFoundException, InvalidRequestException {
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
        if (userId == null){
            throw new InvalidRequestException("User ID cannot be null");
        }
        List<Long> singleRoomIds = singleRoomRepository.findIdsByLandlordId(userId);
        List<Long> studioIds = studioRepository.findIdsByLandlordId(userId);
        List<Long> apartmentIds = apartmentRepository.findIdsByLandlordId(userId);

        List<Long> allIds = Stream.of(singleRoomIds, studioIds, apartmentIds)
                .flatMap(Collection::stream)
                .toList();

        singleRoomRepository.deleteAllByLandlordId(userId);
        studioRepository.deleteAllByLandlordId(userId);
        apartmentRepository.deleteAllByLandlordId(userId);

        listingEventPublisher.publishBulkDeleteEvent(allIds);
    }

    @Override
    public List<ListingDTO> getRooms(GetListingRequest listingRequest) throws NotFoundException {
        List<ListingDTO> rooms = new ArrayList<>();
        singleRoomRepository.findAllByLandlordId(listingRequest.getLandlordId())
                .forEach(singleRoom -> {
                    rooms.add(singleRoomMapper.toDTO(singleRoom));
                });

        studioRepository.findAllByLandlordId(listingRequest.getLandlordId())
                .forEach(studio -> {
                    rooms.add(studioMapper.toDTO(studio));
                });

        apartmentRepository.findAllByLandlordId(listingRequest.getLandlordId())
                .forEach(apartment -> {
                    rooms.add(apartmentMapper.toDTO(apartment));
                });


        return rooms;
    }

    private void findListingById(Long listingId, String listinType) throws NotFoundException {
        if (listingId == null){
            throw new InvalidRequestException("Listing id cannot be null");
        }
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
            default -> throw new InvalidRequestException("Invalid room type. Select one of the available room types: SingleRoom, Studio, Apartment");
        }
    }

    private ListingDTO saveRoom(ListingDTO listingDTO) throws NotFoundException {
        if(listingDTO == null) {
            throw new InvalidRequestException("Listing cannot be null");
        }else if(listingDTO.getListingType() == null){
            throw new InvalidRequestException("ListingType cannot be null");
        }
        return switch (listingDTO.getListingType()) {
            case "SingleRoom" -> singleRoomMapper.toDTO(
                    singleRoomRepository.save(singleRoomMapper.toEntity(
                            convertTo(SingleRoomDTO.class, listingDTO)
                    ))
            );
            case "Studio" -> studioMapper.toDTO(
                    studioRepository.save(studioMapper.toEntity(
                            convertTo(StudioDTO.class, listingDTO)
                    ))
            );
            case "Apartment" -> apartmentMapper.toDTO(
                    apartmentRepository.save(apartmentMapper.toEntity(
                            convertTo(ApartmentDTO.class, listingDTO)
                    ))
            );
            default -> throw new InvalidRequestException("Unsupported listing type: " + listingDTO.getListingType());
        };
    }


    private <T> T convertTo(Class<T> targetClass, ListingDTO source) {
        ObjectMapper mapper = new ObjectMapper();  // or inject a singleton
        return mapper.convertValue(source, targetClass);
    }

}
