import React, { useEffect, useState } from "react";
import SeatSelectionPopup from "./SeatSelectionPage";
import { Seat } from "./Seat"; // Ensure Seat is imported correctly
import axios from "axios";
import { CartItem } from '../types/CartItem';


// Define Spectacle interface (adjust according to your actual structure)
interface Spectacle {
  id: number;
  name: string;
  details: string;
  imageData: string;
  price: number;
  date: string;
  hour: string;
  imageUrl: string;
  category: string;
}


interface ShowProps {
  title: string;
  spectacleId: number;
}

const Show: React.FC<ShowProps> = ({ title, spectacleId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]); // Seats selected by the user
  const [availableSeats, setAvailableSeats] = useState<Seat[]>([]); // All available seats
  const [loading, setLoading] = useState<boolean>(false); // Loading state for fetching seats
  const [error, setError] = useState<string | null>(null); // Error state if fetching fails
  const [selectedSpectacle, setSelectedSpectacle] = useState<Spectacle | null>(null); // Selected spectacle details

  // Fetch available seats and spectacle details when spectacleId changes
  useEffect(() => {
    setLoading(true);
    setError(null); // Reset error on new fetch

    // Fetch the spectacle details
    axios
      .get<Spectacle>(`http://localhost:8080/api/spectacles/${spectacleId}`)
      .then((response) => {
        setSelectedSpectacle(response.data); // Set spectacle details
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch spectacle details. Please try again later.");
        setLoading(false);
      });

    // Fetch available seats
    axios
      .get<Seat[]>(`http://localhost:8080/api/spectacles/seats/${spectacleId}`)
      .then((response) => {
        setAvailableSeats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch seats. Please try again later.");
        setLoading(false);
      });
  }, [spectacleId]);

  // Handle seat selection: add/remove seat from the cart
  const handleSeatSelect = (seat: Seat) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(item => item.seat.id === seat.id);
  
      if (existingItemIndex !== -1) {
        // Seat is already in the cart, remove it
        return prevCart.filter((_, index) => index !== existingItemIndex);
      } else {
        // Seat is not in the cart, add it
        const newCartItem: CartItem = {
          id: Date.now(), // or use a UUID
          seat,
          spectacleId,
          seatNumber: `R${seat.seatRow}-C${seat.seatColumn}`,
          price: selectedSpectacle?.price || 0,
          initialCount: 1,
        };
  
        return [...prevCart, newCartItem];
      }
    });
  };
  

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold">{title}</h2>

      {/* Loading and Error States */}
      {loading && <p>Loading seats...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Button to show the popup */}
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        onClick={() => setShowPopup(true)}
        disabled={loading} // Disable while loading
      >
        Select Seats
      </button>

      {/* Seat Selection Popup */}
      {showPopup && selectedSpectacle && (
        <SeatSelectionPopup
          spectacleId={spectacleId}
          onClose={() => setShowPopup(false)}
          availableSeats={availableSeats}
          setCart={setCart}
          cart={cart}
          onSeatSelect={handleSeatSelect}
          selectedSpectacle={selectedSpectacle} // Pass the selected spectacle details here
        />
      )}

      {/* Cart summary (optional) */}
      <div className="mt-4">
        <h3 className="text-lg font-bold">Selected Seats:</h3>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>{`Seat ${item.seat.label}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Show;
