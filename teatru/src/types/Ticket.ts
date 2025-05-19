export interface Ticket {
  id: number;
  seatNumber: string;
  seatId: number;
  spectacleName: string;
  spectacleDate: string;
  imageData?: string;
  purchaseDate: string;
  price: number;
}
