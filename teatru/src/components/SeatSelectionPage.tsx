import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { Seat } from "./Seat";
import SeatComponent from "./Seat";
import { CartItem } from "../types/CartItem";
import { useAppContext } from "../context/Context";
import "../seats.css";

interface Spectacle {
  id: number;
  name: string;
  details: string;
  date: string;
  hour: string;
  price: number;
  imageUrl: string;
  category: string;
  imageData?: string;
}

interface SeatSelectionPageProps {
  spectacleId: number;
  availableSeats: Seat[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onClose: () => void;
  onSeatSelect: (seat: Seat) => void;
  selectedSpectacle: Spectacle;
}

const SeatSelectionPage: React.FC<SeatSelectionPageProps> = ({
  spectacleId,
  cart,
  onClose,
  onSeatSelect,
  selectedSpectacle,
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { addToCart } = useAppContext();

  useEffect(() => {
  api
    .get<Seat[]>(`/spectacles/seats/${spectacleId}`)
    .then((res) => {
      setSeats(res.data);

      const cartSeatIds = cart
        .filter((item) => item.spectacleId === selectedSpectacle.id)
        .map((item) => item.seatId);

      const preloadedSeats = res.data.filter(seat => cartSeatIds.includes(Number(seat.id)));
      setSelectedSeats(preloadedSeats);
    })
    .catch((err) => console.error("Error loading seats:", err));
}, [spectacleId, cart, selectedSpectacle.id]);


  const handleSelect = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    const updatedSelection = isSelected
      ? selectedSeats.filter((s) => s.id !== seat.id)
      : [...selectedSeats, seat];
    setSelectedSeats(updatedSelection);
    onSeatSelect(seat);
  };

  const handleConfirm = () => {
  const newItems: CartItem[] = selectedSeats.map((seat, index) => ({
    id: Date.now() + index,
    seatId: Number(seat.id), // ✅ adăugăm câmpul cerut de CartItem
    seatNumber: `R${seat.seatRow}-C${seat.seatColumn}`,
    price: selectedSpectacle.price,
    initialCount: 1,
    spectacleId: selectedSpectacle.id,
    spectacleName: selectedSpectacle.name,
    spectacleDate: selectedSpectacle.date,
    imageData: selectedSpectacle.imageData,
  }));

  newItems.forEach((item) => addToCart(item));
  alert(`You selected ${selectedSeats.length} seat(s).`);
  onClose();
};

  // Group seats by rows
  const groupedSeats: Record<number, Seat[]> = seats.reduce((acc, seat) => {
    if (!acc[seat.seatRow]) {
      acc[seat.seatRow] = [];
    }
    acc[seat.seatRow].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  return (
    <div className="seat-selection-page container">
      <h2 className="text-center mt-4 mb-3">🎭 Select Your Seats</h2>
      <div className="screen mb-4 text-center">STAGE</div>

      <div className="theater-layout">
        {Object.entries(groupedSeats)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([row, rowSeats]) => (
            <div key={row} className="seat-row">
              {rowSeats
                .sort((a, b) => a.seatColumn - b.seatColumn)
                .map((seat) => (
                  <SeatComponent
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeats.some((s) => s.id === seat.id)}
                    onSelect={handleSelect}
                  />
                ))}
            </div>
          ))}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-success me-2" onClick={handleConfirm}>
          Confirm Selection
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
