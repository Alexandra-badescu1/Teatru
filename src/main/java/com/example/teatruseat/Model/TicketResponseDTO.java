package com.example.teatruseat.Model;

import lombok.Data;

@Data
public class TicketResponseDTO {
    private Long id;
    private String seatNumber;
    private Long seatId;
    private String spectacleName;
    private String spectacleDate;
    private byte[] imageData;
    private String purchaseDate;
    private double price;
}
