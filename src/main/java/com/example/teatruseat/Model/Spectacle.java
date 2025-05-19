package com.example.teatruseat.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Data
@Entity
public class Spectacle {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    private String name;
    private String details;
    private String date;
    private String hour;
    private double price;
    private String imageName;
    private String imageType;

    @Lob
    private byte[] imageDate;
    private String category;

    @OneToMany(mappedBy = "spectacle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Seat> seats;

}
