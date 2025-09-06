export interface TicketData {
  ticketNumber: string;
  departureStation: string;
  arrivalStation: string;
  trainNumber: string;
  departureTime: string;
  date: string;
  seatNumber: string;
  carNumber: string;
  price: string;
  seatType: string;
  passengerName: string;
  idNumber: string;
}

export interface TicketFormData {
  id?: string;
  ticketNumber: string;
  departureStation: string;
  arrivalStation: string;
  trainNumber: string;
  departureTime: string;
  date: string;
  seatNumber: string;
  carNumber: string;
  price: string;
  seatType: string;
  passengerName: string;
  idNumber: string;
}