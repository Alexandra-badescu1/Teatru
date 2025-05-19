package com.example.teatruseat.Repository;

import com.example.teatruseat.Model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepositorySeat extends JpaRepository<Seat, Long> {
    Optional<Seat> findBySeatRowAndSeatColumn(int seatRow, int seatColumn);
    List<Seat> findBySpectacleId(int spectacleId);


    void deleteById(Long id);
}

