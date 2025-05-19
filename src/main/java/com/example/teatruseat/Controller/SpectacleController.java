package com.example.teatruseat.Controller;

import com.example.teatruseat.Model.Seat;
import com.example.teatruseat.Model.Spectacle;
import com.example.teatruseat.Service.ServiceSeat;
import com.example.teatruseat.Service.ServiceSpectacle;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController// Adjust this to the correct front-end URL
@RequestMapping("/api/spectacles")
public class SpectacleController {

    private final ServiceSpectacle spectacleService;
    private final ServiceSeat seatService;

    public SpectacleController(ServiceSpectacle spectacleService, ServiceSeat seatService) {
        this.spectacleService = spectacleService;
        this.seatService = seatService;
    }

    // Get all spectacles with image encoding as base64
    @GetMapping("/spectacles")
    public List<Spectacle> getAllSpectacles() {
        List<Spectacle> spectacles = spectacleService.findAllSpectacles();
        for (Spectacle spectacle : spectacles) {
            if (spectacle.getImageDate() != null) {
                spectacle.setImageDate(Base64.getEncoder().encodeToString(spectacle.getImageDate()).getBytes());
            }
        }
        return spectacles;
    }

    // Add a new spectacle along with an image
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addSpectacle(@RequestPart("spectacle") String spectacle,
                                               @RequestPart("imageFile") MultipartFile imageFile) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Spectacle spectacle1 = objectMapper.readValue(spectacle, Spectacle.class);
            spectacleService.saveSpectacle(spectacle1, imageFile);
            return ResponseEntity.ok("Spectacle added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding spectacle: " + e.getMessage());
        }
    }

    // Get spectacle image by ID as a base64 encoded string
    @GetMapping("/{id}/image")
    public ResponseEntity<String> getSpectacleImage(@PathVariable int id) {
        try {
            Spectacle spectacle = spectacleService.findSpectacleById(id);
            if (spectacle != null && spectacle.getImageDate() != null) {
                byte[] imageBytes = spectacle.getImageDate();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                return ResponseEntity.ok(base64Image); // Return only the base64 string
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching image: " + e.getMessage());
        }
    }



    // Get the spectacle for today
    @GetMapping("/today")
    public ResponseEntity<Object> getTodaySpectacle() {
        try {
            Spectacle spectacle = spectacleService.findTodaySpectacle();
            return ResponseEntity.ok(spectacle);
        } catch (RuntimeException ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "No spectacle today");
            errorResponse.put("message", ex.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Get available seats for a spectacle
    @GetMapping("/seats/{spectacleId}")
    public List<Seat> getSeatsForSpectacle(@PathVariable int spectacleId) {
        return seatService.findSeatsBySpectacleId(spectacleId);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateSpectacle(@PathVariable int id, @RequestBody Spectacle spectacle) {
        try {
            spectacleService.updateSpectacle(id, spectacle);
            return ResponseEntity.ok("Spectacle updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating spectacle: " + e.getMessage());
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSpectacle(@PathVariable int id) {
        try {
            spectacleService.deleteSpectacle(id);
            return ResponseEntity.ok("Spectacle deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting spectacle: " + e.getMessage());
        }
    }
}
