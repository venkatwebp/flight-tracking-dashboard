import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Flight } from '../models/flight.model';
import { DashboardSummary } from '../models/dashboard.model';
import { FlightFilter } from '../models/flight-filter.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private readonly apiUrl = 'assets/data/flights.json';

  private flightsSubject = new BehaviorSubject<Flight[]>([]);
  private selectedFlightSubject = new BehaviorSubject<Flight | null>(null);
  private filteredFlightsSubject = new BehaviorSubject<Flight[]>([]);
  private dashboardSummarySubject =
  new BehaviorSubject<DashboardSummary>({
    totalFlights: 0,
    activeFlights: 0,
    delayedFlights: 0,
    arrivedFlights: 0
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<boolean>(false);
  
  filteredFlights$ = this.filteredFlightsSubject.asObservable();
  dashboardSummary$ = this.dashboardSummarySubject.asObservable();
  flights$ = this.flightsSubject.asObservable();
  selectedFlight$ = this.selectedFlightSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadFlights(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(false);

    this.http.get<Flight[]>(this.apiUrl)
      .subscribe({
        next: (flights) => {
          this.flightsSubject.next(flights);
          this.filteredFlightsSubject.next(flights);
          this.updateDashboardSummary(flights);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          console.error('Unable to load flight data', error);
          this.loadingSubject.next(false);
          this.errorSubject.next(true);
        }
      });

  }

  private updateDashboardSummary(flights: Flight[]): void {
    this.dashboardSummarySubject.next({
      totalFlights: flights.length,

      activeFlights: flights.filter(
        flight => flight.status === 'Active'
      ).length,

      delayedFlights: flights.filter(
        flight => flight.status === 'Delayed'
      ).length,

      arrivedFlights: flights.filter(
        flight => flight.status === 'Arrived'
      ).length

    });

  }

  getFlights(): Observable<Flight[]> {
    return this.flights$;
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.dashboardSummary$;
  }

  selectFlight(flight: Flight): void {
    console.log('Selected Flight:', flight);
    this.selectedFlightSubject.next(flight);
  }

  clearSelectedFlight(): void{
    this.selectedFlightSubject.next(null);
  }

  getSelectedFlight(): Observable<Flight | null> {
    return this.selectedFlight$;
  }

  getFilteredFlights(): Observable<Flight[]> {
    return this.filteredFlights$;
  }

  getLoader(): Observable<boolean>{
    return this.loading$;
  }

  applyFilters(filter: FlightFilter): void {

    const flights = this.flightsSubject.getValue();

    const filteredFlights = flights.filter(flight => {

      const callsignMatch =
        !filter.callsign ||
        flight.callsign.toLowerCase().includes(filter.callsign.toLowerCase());

      const statusMatch =
        filter.status === 'All' ||
        flight.status === filter.status;

      const originMatch =
        filter.origin === 'All' ||
        flight.origin === filter.origin;

      const destinationMatch =
        filter.destination === 'All' ||
        flight.destination === filter.destination;

      return (
        callsignMatch &&
        statusMatch &&
        originMatch &&
        destinationMatch
      );

    });

    this.filteredFlightsSubject.next(filteredFlights);

    this.updateDashboardSummary(flights);

  }

}