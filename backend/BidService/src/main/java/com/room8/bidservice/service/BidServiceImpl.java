package com.room8.bidservice.service;

import com.room8.bidservice.enums.BidStatus;
import com.room8.bidservice.exception.NoBidFoundException;
import com.room8.bidservice.messaging.BidsEventPublisher;
import com.room8.bidservice.model.Bid;
import com.room8.bidservice.model.RequestBidDTO;
import com.room8.bidservice.model.ResponseBidDTO;
import com.room8.bidservice.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService{
    private final BidRepository bidRepository;
    private final MapperService<ResponseBidDTO, Bid, RequestBidDTO> bidMapperService;
    private final BidsEventPublisher bidsEventPublisher;

    @Override
    public ResponseBidDTO addBid(RequestBidDTO requestBidDTO) {
        var bidDto =  bidMapperService.toDTO(
                bidRepository.save(bidMapperService.toEntity(requestBidDTO))
        );
        bidsEventPublisher.publishListingEvent(bidDto.getListingId(), "NOTIFY_LANDLORD", bidDto.getId());
        return bidDto;
    }

    @Override
    public ResponseBidDTO updateBid(RequestBidDTO requestBidDTO, Long id) {
        return bidMapperService.toDTO(
                bidRepository.findById(id)
                        .map(existingBid -> {
                            bidMapperService.updateEntity(requestBidDTO, existingBid);
                            return bidRepository.save(existingBid);
                        })
                        .orElseThrow(() -> new NoBidFoundException("No bid found with id: " + id))
        );
    }

    @Override
    public String removeBid(Long id) throws Exception, NoBidFoundException {
        return bidRepository.findById(id)
                .map(bid -> {
                    bidRepository.delete(bid);
                    return "Bid with id: " + id + " has been deleted successfully.";
                })
                .orElseThrow(() -> new NoBidFoundException("No bid found with id: " + id));
    }

    @Override
    public ResponseBidDTO getBid(Long id) throws NoBidFoundException {
        return bidRepository.findById(id)
                .map(bidMapperService::toDTO)
                .orElseThrow(() -> new NoBidFoundException("No bid found with id: " + id));
    }

    @Override
    public List<ResponseBidDTO> getAllBidsByListingId(Long listingId) throws NoBidFoundException {
        return bidRepository.findAllByListingId(listingId)
                .stream()
                .map(bidMapperService::toDTO)
                .toList();
    }

    @Override
    public List<ResponseBidDTO> getAllBidsByUserId(Long userId) throws NoBidFoundException {
        return bidRepository.findAllByBidderId(userId)
                .stream()
                .map(bidMapperService::toDTO)
                .toList();
    }

    @Override
    public ResponseBidDTO getBidByUserIdListingId(Long userId, Long listingId) throws NoBidFoundException {
        return bidMapperService.toDTO(bidRepository.findByBidderIdAndListingId(userId, listingId)
                .orElseThrow(() -> new NoBidFoundException("no bid found for user with id: " + userId + "on listing with id: " +listingId)
                ));
    }

    @Override
    public ResponseBidDTO updateBidStatus(Long id, String status) throws NoBidFoundException {
        // 1. Find the existing bid from the database
        Bid existingBid = bidRepository.findById(id)
                .orElseThrow(() -> new NoBidFoundException("No bid found with id: " + id));

        // 2. Update the status using the BidStatus enum for safety
        try {
            BidStatus newStatus = BidStatus.valueOf(status.trim().toUpperCase());
            existingBid.setBidStatus(newStatus);
            existingBid.setLastUpdated(new Date());
        } catch (IllegalArgumentException e) {
            // This happens if the status string is not a valid enum value
            throw new IllegalArgumentException("Invalid status value: " + status);
        }

        // 3. Save the updated bid back to the database
        Bid updatedBid = bidRepository.save(existingBid);

        // 4. Publish an event to Kafka to notify the tenant
        bidsEventPublisher.publishListingEvent(updatedBid.getListingId(), "BID_STATUS_CHANGED", updatedBid.getId());

        // 5. Map the result back to a DTO and return it
        return bidMapperService.toDTO(updatedBid);
    }
}
