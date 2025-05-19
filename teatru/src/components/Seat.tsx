import React from "react";
import "../seats.css";
import seatImg from "../assets/seat.png";
import balconyImg from "../assets/balcony.png";

export interface Seat {
  id: number | string;
  type: string;
  price: number;
  reserved: boolean;
  label: string;
  seatRow: number;
  seatColumn: number;
  category: string;
}

interface SeatProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seat: Seat) => void;
}

const SeatComponent: React.FC<SeatProps> = ({ seat, isSelected, onSelect }) => {
  const getSeatImage = () => {
    return seat.category === "balcony" ? balconyImg : seatImg;
  };

  return (
    <div className={`seat-container ${seat.category}`}>
      <button
        onClick={() => !seat.reserved && onSelect(seat)}
        disabled={seat.reserved}
        className={`seat-button ${seat.category} ${
          isSelected ? "selected" : ""
        } ${seat.reserved ? "reserved" : ""}`}
      >
        <img 
          src={getSeatImage()} 
          alt="seat" 
          className={`seat-img ${seat.reserved ? "reserved-img" : ""}`}
        />
      </button>
      <span className={`seat-label ${isSelected ? "selected" : ""} ${seat.reserved ? "reserved" : ""}`}>
        {seat.label}
      </span>
    </div>
  );
};

export default SeatComponent;