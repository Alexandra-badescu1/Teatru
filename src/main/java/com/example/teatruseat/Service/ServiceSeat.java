package com.example.teatruseat.Service;

import com.example.teatruseat.Model.Seat;
import com.example.teatruseat.Repository.RepositorySeat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceSeat {
    @Autowired
    private RepositorySeat seatRepository;

    public void deleteSeatById(Long id) {
        seatRepository.deleteById(id);
    }
    public void deleteAllSeats() {
        seatRepository.deleteAll();
    }
    public void saveSeat(Seat seat) {
        seatRepository.save(seat);
    }
    public Seat getSeatById(Long id) {
        return seatRepository.findById(id).orElse(null);
    }
    public Iterable<Seat> getAllSeats() {
        return seatRepository.findAll();
    }
    public List<Seat> findSeatsBySpectacleId(int spectacleId) {
        return seatRepository.findBySpectacleId(spectacleId);
    }

}
