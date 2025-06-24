package com.room8.bidservice.service;

import com.room8.bidservice.client.UserAuthServiceInterface;
import com.room8.bidservice.enums.BidStatus;
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
    public ResponseBidDTO toDTO(Bid bid) {
        UserDTO userDTO;
        try {
            userDTO = userAuthService.getUserFromId(bid.getBidderId()).getBody();
            assert userDTO != null;
        }catch (Exception e){
            throw new RuntimeException(e);
        }

        return ResponseBidDTO.builder()
                .id(bid.getId())
                .listingId(bid.getListingId())
                .bidderId(bid.getBidderId())
                .isShareInfo(bid.getIsShareInfo())
                .proposal(bid.getProposal())
                .bidDate(bid.getBidDate())
                .bidStatus(bid.getBidStatus())
                .lastUpdated(bid.getLastUpdated())
                .build();
    }

    @Override
    public Bid toEntity(RequestBidDTO requestBidDTO) {
        return Bid.builder()
                .listingId(requestBidDTO.getListingId())
                .bidderId(requestBidDTO.getBidderId())
                .proposal(requestBidDTO.getProposal())
                .isShareInfo(requestBidDTO.getIsShareInfo())
                .bidStatus(BidStatus.PENDING)
                .build();
    }

    @Override
    public void updateEntity(RequestBidDTO requestBidDTO, Bid bid) {
        bid.setProposal(requestBidDTO.getProposal());
        bid.setIsShareInfo(requestBidDTO.getIsShareInfo());
        bid.setLastUpdated(new Date());
    }
}
