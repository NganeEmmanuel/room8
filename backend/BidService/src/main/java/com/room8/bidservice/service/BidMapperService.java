package com.room8.bidservice.service;

import com.room8.bidservice.feignInterface.UserAuthServiceInterface;
import com.room8.bidservice.model.Bid;
import com.room8.bidservice.model.RequestBidDTO;
import com.room8.bidservice.model.ResponseBidDTO;
import com.room8.bidservice.model.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class BidMapperService implements MapperService<ResponseBidDTO, Bid, RequestBidDTO>{
    private final UserAuthServiceInterface userAuthService;

    @Override
    public ResponseBidDTO toResponseDTO(Bid bid) {
        UserDTO userDTO;
        try {
            userDTO = userAuthService.getUserFromId(bid.getBidderId()).getBody();
            assert userDTO != null;
        }catch (Exception e){
            throw new RuntimeException(e);
        }

        return ResponseBidDTO.builder()
                .id(bid.getId())
                .ListingId(bid.getListingId())
                .bidderFullName(userDTO.getFirstName() + " " + userDTO.getLastName())
                .bidderInfo(bid.getBidderInfo())
                .proposal(bid.getProposal())
                .bidDate(bid.getBidDate())
                .lastUpdated(bid.getLastUpdated())
                .build();
    }

    @Override
    public Bid requestDTOToEntity(RequestBidDTO requestBidDTO) {
        return Bid.builder()
                .ListingId(requestBidDTO.getListingId())
                .bidderId(requestBidDTO.getBidderId())
                .proposal(requestBidDTO.getProposal())
                .build();
    }

    @Override
    public void updateEntity(RequestBidDTO requestBidDTO, Bid bid) {
        bid.setProposal(requestBidDTO.getProposal());
        bid.setLastUpdated(new Date());
    }
}
