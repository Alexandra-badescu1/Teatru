package com.example.teatruseat.Repository;

import com.example.teatruseat.Model.Spectacle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositorySpectacle extends JpaRepository<Spectacle, Long> {
    Optional<Spectacle> findByDate(String date);


}