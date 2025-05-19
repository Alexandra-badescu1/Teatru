package com.example.teatruseat.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Seat seat;

    @ManyToOne
    @JsonIgnore
    private Spectacle spectacle;

    @ManyToOne
    @JsonIgnore
    private User user;


    private boolean purchased;

    private LocalDateTime purchaseDate;
}
