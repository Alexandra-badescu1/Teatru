package com.example.teatruseat.Controller;

import com.example.teatruseat.Model.Seat;
import com.example.teatruseat.Repository.RepositorySeat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seats")
public class SeatController {
    @Autowired
    private final RepositorySeat seatRepository;

    public SeatController(RepositorySeat seatRepository) {
        this.seatRepository = seatRepository;
    }

    @GetMapping
    public List<Seat> getSeatsBySpectacleId(@RequestParam int spectacleId) {
        return seatRepository.findBySpectacleId(spectacleId);
    }
}
