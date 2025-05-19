import React from "react";
import { useAppContext } from "../context/Context";
import { CartItem } from "../types/CartItem";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const {
    cart,
    updateCartItemCount,
    removeFromCart,
    saveTicketHistory,
    clearCart
  } = useAppContext();

  const getTotalPrice = (item: CartItem) => item.initialCount * item.price;
  const total = cart.reduce((sum, item) => sum + getTotalPrice(item), 0);
  const navigate = useNavigate();

  const handleCountChange = (id: number, delta: number) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      const newCount = Math.max(1, item.initialCount + delta);
      updateCartItemCount(id, newCount);
    }
  };

  const handleCheckout = () => {
  if (cart.length === 0) return;
  saveTicketHistory(cart);
  clearCart();
  alert("✅ Order placed successfully!");
  navigate("/profile"); // 🔁 redirecționează după checkout
};

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="d-flex flex-column align-items-center gap-4">
            {cart.map((item) => (
  <div
    key={item.id}
    className="card shadow-sm border-dark p-3 bg-white"
    style={{ maxWidth: '700px', width: '100%' }}
  >
    <div className="d-flex flex-column flex-md-row align-items-start">
      {item.imageData ? (
        <img
          src={`data:image/jpeg;base64,${item.imageData}`}
          alt={item.spectacleName}
          style={{
            width: '160px',
            height: '160px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginRight: '20px',
            marginBottom: '10px',
          }}
        />
      ) : (
        <div
          className="bg-secondary d-flex align-items-center justify-content-center text-white"
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '8px',
            marginRight: '20px',
            marginBottom: '10px',
            fontSize: '0.8rem',
            textAlign: 'center',
          }}
        >
          No image
        </div>
      )}

      <div className="flex-grow-1">
        <h5 className="card-title text-primary mb-2">{item.spectacleName}</h5>
        <p className="mb-1"><strong>Date:</strong> {item.spectacleDate}</p>
        <p className="mb-1"><strong>Seat:</strong> {item.seatNumber}</p>

        <div className="d-flex align-items-center gap-2 mb-2 mt-2">
          <button
            onClick={() => handleCountChange(item.id, -1)}
            className="btn btn-sm btn-danger"
          >
            −
          </button>
          <span>{item.initialCount}</span>
          <button
            onClick={() => handleCountChange(item.id, 1)}
            className="btn btn-sm btn-success"
          >
            +
          </button>
        </div>

        <p className="fw-bold mb-0">€{getTotalPrice(item).toFixed(2)}</p>
        <p className="text-muted small mb-2">€{item.price} each</p>

        <button
          onClick={() => removeFromCart(item.id)}
          className="btn btn-link text-danger p-0"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  </div>
))}

          </div>
        )}


      {cart.length > 0 && (
        <div className="text-center mt-8">
          <h3 className="text-2xl font-bold mb-4">Total: €{total.toFixed(2)}</h3>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg"
          >
            ✅ Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
