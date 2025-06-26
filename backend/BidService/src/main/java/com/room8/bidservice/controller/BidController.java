package com.room8.bidservice.controller;

import com.room8.bidservice.exception.NoBidFoundException;
import com.room8.bidservice.model.RequestBidDTO;
import com.room8.bidservice.model.ResponseBidDTO;
import com.room8.bidservice.model.UpdateBidStatusDTO;
import com.room8.bidservice.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/bids")
public class BidController {
    private final BidService bidService;

    @PostMapping("/add-bid")
    ResponseEntity<ResponseBidDTO> addBit(@RequestBody RequestBidDTO bidDTO) {
        return ResponseEntity.ok(bidService.addBid(bidDTO));
    }

    @PutMapping("/update-bid")
    ResponseEntity<ResponseBidDTO> updateBid(@RequestBody RequestBidDTO bidDTO, @RequestParam Long id) throws NoBidFoundException {
        return ResponseEntity.ok(bidService.updateBid(bidDTO, id));
    }

    @RequestMapping("/remove-bid")
    ResponseEntity<String> removeBid(@RequestParam Long id) throws Exception, NoBidFoundException {
        return ResponseEntity.ok(bidService.removeBid(id));
    }

    @GetMapping("/get-bid")
    ResponseEntity<ResponseBidDTO> getBid(@RequestParam Long id) throws NoBidFoundException {
        return ResponseEntity.ok(bidService.getBid(id));
    }

    @GetMapping("/get-bids-by-listingId")
    ResponseEntity<List<ResponseBidDTO>> getBidsByListingId(@RequestParam Long listingId) throws NoBidFoundException {
        return ResponseEntity.ok(bidService.getAllBidsByListingId(listingId));
    }

    @GetMapping("/get-bids-by-userId")
    ResponseEntity<List<ResponseBidDTO>> getBidsByUserId(@RequestParam Long userId) throws NoBidFoundException {
        return ResponseEntity.ok(bidService.getAllBidsByUserId(userId));
    }

    @GetMapping("/get-bid-by-userId-listingId")
    ResponseEntity<ResponseBidDTO> getBidsByUserIdListingId(@RequestParam Long userId, @RequestParam Long listingId) throws NoBidFoundException {
        return ResponseEntity.ok(bidService.getBidByUserIdListingId(userId, listingId));
    }

    @PutMapping("/{bidId}/status")
    public ResponseEntity<ResponseBidDTO> updateBidStatus(
            @PathVariable Long bidId,
            @RequestBody UpdateBidStatusDTO statusUpdate) throws NoBidFoundException {

        ResponseBidDTO updatedBid = bidService.updateBidStatus(bidId, statusUpdate.getStatus());
        return ResponseEntity.ok(updatedBid);
    }
}
