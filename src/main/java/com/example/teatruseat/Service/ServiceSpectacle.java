package com.example.teatruseat.Service;


import com.example.teatruseat.Model.Seat;
import com.example.teatruseat.Model.Spectacle;
import com.example.teatruseat.Repository.RepositorySeat;
import com.example.teatruseat.Repository.RepositorySpectacle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceSpectacle {
    @Autowired
    private RepositorySpectacle spectacleRepository;

    public List<Spectacle> findAllSpectacles() {
        return spectacleRepository.findAll();
    }

    public Spectacle findTodaySpectacle() {
        LocalDate today = LocalDate.now();
        return spectacleRepository.findByDate(String.valueOf(today))
                .orElseThrow(() -> new RuntimeException("No spectacle today"));
    }

    public void saveSpectacle(Spectacle spectacle, MultipartFile imageFile) throws IOException {
        spectacle.setImageName(imageFile.getOriginalFilename());
        spectacle.setImageType(imageFile.getContentType());
        spectacle.setImageDate(imageFile.getBytes());
        spectacleRepository.save(spectacle);
    }

    public Spectacle findSpectacleById(int id) {
        return spectacleRepository.findById((long) id)
                .orElseThrow(() -> new RuntimeException("Spectacle not found"));
    }

    public void updateSpectacle(int id, Spectacle updatedSpectacle) {
        Optional<Spectacle> optionalSpectacle = spectacleRepository.findById((long) id);

        if (optionalSpectacle.isEmpty()) {
            throw new RuntimeException("Spectacle not found");
        }

        Spectacle existingSpectacle = optionalSpectacle.get();

        // Actualizare câmpuri
        existingSpectacle.setName(updatedSpectacle.getName());
        existingSpectacle.setDetails(updatedSpectacle.getDetails());
        existingSpectacle.setDate(updatedSpectacle.getDate());
        existingSpectacle.setHour(updatedSpectacle.getHour());
        existingSpectacle.setPrice(updatedSpectacle.getPrice());
        existingSpectacle.setCategory(updatedSpectacle.getCategory());
        existingSpectacle.setImageDate(updatedSpectacle.getImageDate());

        spectacleRepository.save(existingSpectacle);
    }


    public void deleteSpectacle(int id) {
        Spectacle spectacle = spectacleRepository.findById((long) id)
                .orElseThrow(() -> new RuntimeException("Spectacle not found"));
        spectacleRepository.delete(spectacle);
    }
}
