export type FlightStatus =
  | 'Active'
  | 'Delayed'
  | 'Arrived';

export interface Flight {
  id: number;
  flightNumber: string;
  callsign: string;
  aircraftType: string;

  origin: string;
  originLat: number;
  originLng: number;

  destination: string;
  destinationLat: number;
  destinationLng: number;

  currentLat: number;
  currentLng: number;

  status: FlightStatus;

  estimatedDeparture: string;
  estimatedArrival: string;
}