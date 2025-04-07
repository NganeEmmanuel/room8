package com.room8.bidservice.service;

import com.room8.bidservice.exception.NoBidFoundException;
import com.room8.bidservice.model.Bid;
import com.room8.bidservice.model.RequestBidDTO;
import com.room8.bidservice.model.ResponseBidDTO;
import com.room8.bidservice.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService{
    private final BidRepository bidRepository;
    private final MapperService<ResponseBidDTO, Bid, RequestBidDTO> bidMapperService;

    @Override
    public ResponseBidDTO addBid(RequestBidDTO requestBidDTO) {
        return null; // todo implement this method
    }

    @Override
    public ResponseBidDTO updateBid(RequestBidDTO requestBidDTO, Long id) {
        return null; // todo implement this method
    }

    @Override
    public String removeBid(Long id) throws Exception, NoBidFoundException {
        return ""; // todo implement this method
    }

    @Override
    public ResponseBidDTO getBid(Long id) throws NoBidFoundException {
        return null; // todo implement this method
    }

    @Override
    public List<ResponseBidDTO> getAllBidsByListingId(Long listingId) throws NoBidFoundException {
        return List.of(); // todo implement this method
    }

    @Override
    public List<ResponseBidDTO> getAllBidsByUserId(Long userId) throws NoBidFoundException {
        return List.of(); // todo implement this method
    }
}
