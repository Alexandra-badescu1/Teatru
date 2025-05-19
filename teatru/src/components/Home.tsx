import React, { useEffect, useState } from "react";
import { Seat } from "./Seat";
import SeatSelectionPage from "./SeatSelectionPage";
import { CartItem } from '../types/CartItem';
import api from "../utils/axios";

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

interface HomeProps {
  selectedCategory: string | null;
}

const HomePage: React.FC<HomeProps> = ({ selectedCategory }) => {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [availableSeats, setAvailableSeats] = useState<Seat[]>([]);
  const [selectedSpectacle, setSelectedSpectacle] = useState<Spectacle | null>(null);
  const [isSelectingSeats, setIsSelectingSeats] = useState<boolean>(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const availableCategories = [
    "Old spectacles",
    "New spectacles",
    "Weekend special",
    "Most rated",
    "Less rated"
  ];

  useEffect(() => {
    api.get<Spectacle[]>("/spectacles/spectacles")
      .then(async res => {
        const spectaclesWithImages = await Promise.all(
          res.data.map(async (spectacle) => {
            try {
              const imageRes = await api.get<string>(`/spectacles/${spectacle.id}/image`);
              return { ...spectacle, imageData: imageRes.data };
            } catch (error) {
              console.error("Error loading image for spectacle", spectacle.id, error);
              return spectacle;
            }
          })
        );
        setSpectacles(spectaclesWithImages);
      })
      .catch(err => console.error("Error loading spectacles:", err));
  }, []);

  const handleBuyTicket = (spectacle: Spectacle) => {
    setSelectedSpectacle(spectacle);
    setIsSelectingSeats(true);

    api.get<Seat[]>(`/spectacles/seats/${spectacle.id}`)
      .then(res => setAvailableSeats(res.data))
      .catch(err => console.error("Error loading seats:", err));
  };

  const handleFilterChange = (category: string) => {
    setFilters(prev =>
      prev.includes(category)
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
  };

  const filteredSpectacles = spectacles.filter(s => {
    if (filters.length === 0) return true;
    return filters.includes(s.category);
  });

  const getMedianPriceSpectacle = (spectacles: Spectacle[]) => {
    if (spectacles.length === 0) return null;
    const sorted = [...spectacles].sort((a, b) => a.price - b.price);
    const middleIndex = Math.floor(sorted.length / 2);
    return sorted[middleIndex];
  };

  const medianSpectacle = getMedianPriceSpectacle(spectacles);

  return (
    <div className="main-container">
      <div className="container mt-5">
        {isSelectingSeats ? (
          selectedSpectacle && (
            <SeatSelectionPage
              spectacleId={selectedSpectacle.id}
              availableSeats={availableSeats}
              cart={cart}
              setCart={setCart}
              onClose={() => setIsSelectingSeats(false)}
              onSeatSelect={(seat: Seat) => console.log("Seat selected:", seat)}
              selectedSpectacle={selectedSpectacle}
            />
          )
        ) : (
          <>
            {medianSpectacle && (
              <div className="median-banner mb-4 p-3 bg-light rounded">
                <div className="row align-items-center">
                  <div className="col-md-5"> 
                    <img 
                      src={`data:image/jpeg;base64,${medianSpectacle.imageData}`} 
                      className="img-fluid rounded w-100"
                      alt={medianSpectacle.name}
                      style={{ maxHeight: '300px', objectFit: 'cover' }} 
                    />
                  </div>
                  <div className="col-md-7">
                    <h2 className="text-primary">Featured Spectacle</h2>
                    <h3>{medianSpectacle.name}</h3>
                    <p className="lead">Special Price: <strong>{medianSpectacle.price}€</strong></p>
                    <p>{medianSpectacle.details}</p>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => handleBuyTicket(medianSpectacle)}
                    >
                      Buy Tickets Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="row mt-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="me-3">Filter by Category</h2>
                <div className="vertical-line"></div>
                <h2 className="ms-3">List of Spectacles</h2>
              </div>

              <div className="col-md-3">
                {availableCategories.map(category => (
                  <div key={category} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={category}
                      onChange={() => handleFilterChange(category)}
                      checked={filters.includes(category)}
                    />
                    <label className="form-check-label" htmlFor={category}>
                      {category}
                    </label>
                  </div>
                ))}
              </div>

              <div className="col-md-9">
                <div className="row">
                  {filteredSpectacles.map(spectacle => (
                    <div key={spectacle.id} className="col-md-4 mb-4">
                      <div className="card h-100">
                        <img
                          src={`data:image/jpeg;base64,${spectacle.imageData}`}
                          className="card-img-top"
                          alt={spectacle.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{spectacle.name}</h5>
                          <p className="card-text">{spectacle.details}</p>
                          <p><strong>Date:</strong> {spectacle.date} | <strong>Hour:</strong> {spectacle.hour}</p>
                          <p><strong>Category:</strong> {spectacle.category}</p>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleBuyTicket(spectacle)}
                          >
                            Buy Ticket - {spectacle.price}€
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredSpectacles.length === 0 && (
                    <p>No spectacles match the selected filters.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;