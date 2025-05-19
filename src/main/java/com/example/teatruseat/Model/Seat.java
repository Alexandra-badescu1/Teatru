package com.example.teatruseat.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import static jakarta.persistence.GenerationType.IDENTITY;

@Data
@Entity
public class Seat {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    private String type;
    private double price;
    private boolean reserved;
    private String label;

    @ManyToOne
    @JoinColumn(name = "spectacle_id")
    @JsonBackReference
    private Spectacle spectacle;


    @Column(name = "seat_row")
    private int seatRow;

    @Column(name = "seat_column")
    private int seatColumn;
}
