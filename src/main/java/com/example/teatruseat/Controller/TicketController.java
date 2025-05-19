package com.example.teatruseat.Controller;

import com.example.teatruseat.Model.*;
import com.example.teatruseat.Repository.RepositorySeat;
import com.example.teatruseat.Repository.RepositorySpectacle;
import com.example.teatruseat.Repository.RepositoryTicket;
import com.example.teatruseat.Repository.RepositoryUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ticket")
public class TicketController {

    @Autowired
    private RepositoryTicket ticketRepository;

    @Autowired
    private RepositorySpectacle spectacleRepository;

    @Autowired
    private RepositorySeat seatRepository;
    // ✅ POST: salvează bilete
    @PostMapping
    public List<Ticket> createTickets(@RequestBody List<TicketDTO> ticketDTOs) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = ((UserPrincipales) authentication.getPrincipal()).getUser();

        return ticketDTOs.stream().map(dto -> {
            Spectacle spectacle = spectacleRepository.findById(dto.getSpectacleId())
                    .orElseThrow(() -> new RuntimeException("Spectacle not found"));

            Seat seat = seatRepository.findById(dto.getSeatId())
                    .orElseThrow(() -> new RuntimeException("Seat not found"));

            Ticket ticket = new Ticket();
            ticket.setUser(user);
            ticket.setSpectacle(spectacle);
            ticket.setSeat(seat);
            ticket.setPurchased(true);
            ticket.setPurchaseDate(LocalDateTime.now());

            return ticketRepository.save(ticket);
        }).toList();
    }



    // ✅ GET: biletele pentru un user
    @GetMapping("/my")
    public List<TicketResponseDTO> getMyTickets() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = ((UserPrincipales) auth.getPrincipal()).getUser();

        List<Ticket> tickets = ticketRepository.findByUserUsername(user.getUsername());

        return tickets.stream().map(ticket -> {
            TicketResponseDTO dto = new TicketResponseDTO();
            dto.setId(ticket.getId());
            dto.setPurchaseDate(ticket.getPurchaseDate().toString());
            dto.setPrice(ticket.getSeat().getPrice());

            if (ticket.getSeat() != null) {
                dto.setSeatId(ticket.getSeat().getId());
                dto.setSeatNumber(ticket.getSeat().getLabel());
            }

            if (ticket.getSpectacle() != null) {
                dto.setSpectacleName(ticket.getSpectacle().getName());
                dto.setSpectacleDate(ticket.getSpectacle().getDate());
                dto.setImageData(ticket.getSpectacle().getImageDate());
            }

            return dto;
        }).toList();
    }

}
