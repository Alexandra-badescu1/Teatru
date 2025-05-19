import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppContext } from '../context/Context';
import api from '../utils/axios';

interface Spectacle {
  id: number;
  name: string;
  details: string;
  date: string;
  hour: string;
  price: number;
  category: string;
  imageData?: string;
}

interface Ticket {
  id: number;
  seatNumber: string;
  seatId: number;
  spectacleName: string;
  spectacleDate: string;
  imageData?: string;
  purchaseDate: string;
  price: number;
}

interface SpectacleFormData {
  name: string;
  details: string;
  date: string;
  hour: string;
  price: string;
  category: string;
  imageFile: File | null;
}

const ProfilePage: React.FC = () => {
  const { user, isLoggedIn } = useAppContext();
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [editingSpectacle, setEditingSpectacle] = useState<Spectacle | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<SpectacleFormData>({
    name: '', details: '', date: '', hour: '', price: '', category: '', imageFile: null
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchData = async () => {
      try {
        const spectacleRes = await api.get<Spectacle[]>('/spectacles/spectacles');
        setSpectacles(spectacleRes.data);

        if (!isAdmin) {
          const ticketRes = await api.get<Ticket[]>('/ticket/my');
          setTickets(ticketRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, user]);

  const openModal = (spectacle?: Spectacle) => {
    if (spectacle) {
      setEditingSpectacle(spectacle);
      setFormData({
        name: spectacle.name,
        details: spectacle.details,
        date: spectacle.date,
        hour: spectacle.hour,
        price: spectacle.price.toString(),
        category: spectacle.category,
        imageFile: null
      });
    } else {
      setEditingSpectacle(null);
      setFormData({ name: '', details: '', date: '', hour: '', price: '', category: '', imageFile: null });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      setFormData(prev => ({ ...prev, imageFile: fileList[0] }));
    } else {
      setFormData(prev => ({ ...prev, imageFile: null }));
    }
  };

  const isFormValid = () => {
    const { name, details, date, hour, price, category } = formData;
    if (!name || !details || !date || !hour || !price || !category) return false;
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) return false;
    return true;
  };

  const handleSave = async () => {
  if (!isFormValid()) return;

  try {
    if (editingSpectacle) {
      // Dacă se editează: trimite doar JSON (nu imagine)
      const payload = {
        name: formData.name,
        details: formData.details,
        date: formData.date,
        hour: formData.hour,
        price: parseFloat(formData.price),
        category: formData.category
      };
      const res = await api.put(`/spectacles/update/${editingSpectacle.id}`, payload);
      if (res.status === 200) {
        setSpectacles(prev => prev.map(s => (s.id === editingSpectacle.id ? { ...s, ...payload } : s)));
        closeModal(); // ✅ Închide modalul doar dacă succes
      }
    } else {
      // Dacă se adaugă: trimite FormData (cu imagine)
      const form = new FormData();
      const payload = {
        name: formData.name,
        details: formData.details,
        date: formData.date,
        hour: formData.hour,
        price: parseFloat(formData.price),
        category: formData.category
      };
      form.append('spectacle', JSON.stringify(payload));
      if (formData.imageFile) {
        form.append('imageFile', formData.imageFile);
      }

      const res = await api.post('/spectacles/add', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 200) {
        // Adăugăm local obiectul (opțional poți retrimite lista din backend)
        setSpectacles(prev => [...prev, payload as Spectacle]);
        closeModal(); // ✅ Închide modalul
      }
    }
  } catch (error) {
    console.error('Error saving spectacle:', error);
    // poți adăuga un mesaj de eroare pentru UI dacă dorești
  }
};


  const handleDelete = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this spectacle?")) return;
  try {
    await api.delete(`/spectacles/delete/${id}`);
    setSpectacles(prev => prev.filter(s => s.id !== id));
  } catch (error) {
    console.error("Failed to delete spectacle:", error);
  }
};

  if (!isLoggedIn) return <div className="container mt-5">Please log in to view your profile.</div>;
  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5" style={{ fontFamily: 'Georgia, serif', color: '#2c2c2c' }}>
      <h1 className="mb-4 text-center" style={{ color: '#800000' }}>
        Welcome, <span style={{ fontWeight: 'bold' }}>{user?.username}</span>
      </h1>

      {isAdmin ? (
        <>
          <div className="mb-4 p-3 bg-light border rounded shadow-sm">
            <h2 className="mb-3 text-center" style={{ color: '#800000' }}>🎭 Manage Spectacles</h2>
            <div className="text-end">
              <button className="btn btn-success" onClick={() => openModal()}>+ Add New Spectacle</button>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-4">
            {spectacles.map(s => (
              <div key={s.id} className="col">
                <div className="card h-100 shadow-sm">
                  {s.imageData && (
                    <img
                      src={`data:image/jpeg;base64,${s.imageData}`}
                      className="card-img-top"
                      alt={s.name}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title text-primary">{s.name}</h5>
                    <p><strong>Date:</strong> {s.date}</p>
                    <p><strong>Time:</strong> {s.hour}</p>
                    <p><strong>Category:</strong> {s.category}</p>
                    <p className="text-muted"><strong>Price:</strong> €{s.price}</p>
                    <div className="d-flex justify-content-end">
                      <button className="btn btn-warning me-2" onClick={() => openModal(s)}>✏️ Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>🗑️ Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showModal && (
            <>
              <div className="modal show d-block" tabIndex={-1} role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{editingSpectacle ? 'Edit Spectacle' : 'Add Spectacle'}</h5>
                      <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <input name="name" className="form-control mb-2" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                        <textarea name="details" className="form-control mb-2" placeholder="Details" value={formData.details} onChange={handleInputChange} required />
                        <input type="date" name="date" className="form-control mb-2" value={formData.date} onChange={handleInputChange} required min={new Date().toISOString().split('T')[0]} />
                        <input type="time" name="hour" className="form-control mb-2" value={formData.hour} onChange={handleInputChange} required />
                        <input type="number" name="price" className="form-control mb-2" placeholder="Price" value={formData.price} onChange={handleInputChange} required min={0} step="0.01" />
                        <input name="category" className="form-control mb-2" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
                        <input type="file" className="form-control mb-2" onChange={handleFileChange} />
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleSave} disabled={!isFormValid()}>{editingSpectacle ? 'Update' : 'Create'}</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop show"></div>
            </>
          )}
        </>
      ) : (
        <>
          <h2 className="mb-4 text-center" style={{ color: '#800000' }}>🎟️ Your Ticket History</h2>
          {tickets.length === 0 ? (
            <div className="alert alert-info text-center">You haven't purchased any tickets yet.</div>
          ) : (
            <div className="d-flex flex-column align-items-center gap-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className="card shadow-sm border-dark p-3" style={{ maxWidth: '700px', width: '100%' }}>
                  <div className="d-flex flex-column flex-md-row align-items-start">
                    {ticket.imageData && (
                      <img
                        src={`data:image/jpeg;base64,${ticket.imageData}`}
                        alt={ticket.spectacleName}
                        style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '8px', marginRight: '20px', marginBottom: '10px' }}
                      />
                    )}
                    <div>
                      <h5 className="card-title text-danger mb-2">🎫 {ticket.spectacleName}</h5>
                      <p className="mb-1"><strong>Date:</strong> {ticket.spectacleDate}</p>
                      <p className="mb-1"><strong>Seat:</strong> {ticket.seatNumber}</p>
                      <p className="mb-1"><strong>Purchased on:</strong> {new Date(ticket.purchaseDate).toLocaleString()}</p>
                      <p className="mb-0"><strong>Price:</strong> €{ticket.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
