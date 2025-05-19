import { Seat } from '../components/Seat';

export interface CartItem {
  id: number; // acesta poate fi un id local, folosit doar în cart
  spectacleId: number;  // ✅ ID real al spectacolului
  spectacleName: string;
  spectacleDate: string;
  seatId: number;       // ✅ ID-ul locului (necesar)
  seatNumber: string;
  price: number;
  initialCount: number;
  imageData?: string;
}

