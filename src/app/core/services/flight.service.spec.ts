/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { FlightService } from './flight.service';
import { Flight } from '../models/flight.model';

describe('FlightService', () => {
  let service: FlightService;
  let httpMock: HttpTestingController;

  const flights: Flight[] = [
    {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'Delhi',
      originLat: 28.6139,
      originLng: 77.2090,
      destination: 'Mumbai',
      destinationLat: 19.0760,
      destinationLng: 72.8777,
      currentLat: 23.8449,
      currentLng: 75.0433,
      status: 'Active',
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    },

    {
      id: 2,
      flightNumber: '6E202',
      callsign: 'IGO202',
      aircraftType: 'A321',
      origin: 'Chennai',
      originLat: 13.0827,
      originLng: 80.2707,
      destination: 'Kochi',
      destinationLat: 9.9312,
      destinationLng: 76.2673,
      currentLat: 11.5069,
      currentLng: 78.2690,
      status: 'Delayed',
      estimatedDeparture: '11:00',
      estimatedArrival: '12:30'
    },

    {
      id: 3,
      flightNumber: 'AI303',
      callsign: 'AIC303',
      aircraftType: 'B737',
      origin: 'Hyderabad',
      originLat: 17.3850,
      originLng: 78.4867,
      destination: 'Bangalore',
      destinationLat: 12.9716,
      destinationLng: 77.5946,
      currentLat: 15.1783,
      currentLng: 78.0406,
      status: 'Arrived',
      estimatedDeparture: '08:00',
      estimatedArrival: '09:30'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(FlightService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should select a flight', () => {
    const flight: Flight = {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'Delhi',
      originLat: 28.6139,
      originLng: 77.2090,
      destination: 'Mumbai',
      destinationLat: 19.0760,
      destinationLng: 72.8777,
      currentLat: 23.8449,
      currentLng: 75.0433,
      status: 'Active',
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    };

    service.selectFlight(flight);
    service.getSelectedFlight().subscribe(selectedFlight => {
      expect(selectedFlight).toEqual(flight);
    });
  });

  it('should clear the selected flight', () => {
    service.clearSelectedFlight();
    service.getSelectedFlight().subscribe(selectedFlight => {
      expect(selectedFlight).toBeNull();
    });
  });

  it('should filter flights by status', () => {
    service.loadFlights();
    const request = httpMock.expectOne('assets/data/flights.json');
    request.flush(flights);

    service.applyFilters({
      callsign: '',
      status: 'Delayed',
      origin: 'All',
      destination: 'All'
    });

    service.getFilteredFlights().subscribe(filteredFlights => {
      expect(filteredFlights.length).toBe(1);
      expect(filteredFlights[0].flightNumber).toBe('6E202');
      expect(filteredFlights[0].status).toBe('Delayed');
    });
  });

  it('should filter flights by callsign', () => {
    service.loadFlights();
    const request = httpMock.expectOne('assets/data/flights.json');
    request.flush(flights);

    service.applyFilters({
      callsign: 'IGO',
      status: 'All',
      origin: 'All',
      destination: 'All'
    });

    service.getFilteredFlights().subscribe(filteredFlights => {
      expect(filteredFlights.length).toBe(1);
      expect(filteredFlights[0].callsign).toBe('IGO202');
    });
  })

  it('should filter flights by origin', () => {
    service.loadFlights();
    const request = httpMock.expectOne('assets/data/flights.json');
    request.flush(flights);

    service.applyFilters({
      callsign: '',
      status: 'All',
      origin: 'Chennai',
      destination: 'All'
    });

    service.getFilteredFlights().subscribe(filteredFlights => {
      expect(filteredFlights.length).toBe(1);
      expect(filteredFlights[0].origin).toBe('Chennai');
    });
  });

  it('should filter flights by destination', () => {
    service.loadFlights();
    const request = httpMock.expectOne('assets/data/flights.json');
    request.flush(flights);

    service.applyFilters({
      callsign: '',
      status: 'All',
      origin: 'All',
      destination: 'Kochi'
    });

    service.getFilteredFlights().subscribe(filteredFlights => {
      expect(filteredFlights.length).toBe(1);
      expect(filteredFlights[0].destination).toBe('Kochi');
    });
  });

  it('should apply multiple filters together', () => {
    service.loadFlights();
    const request = httpMock.expectOne('assets/data/flights.json');
    request.flush(flights);

    service.applyFilters({
      callsign: 'IGO',
      status: 'Delayed',
      origin: 'Chennai',
      destination: 'Kochi'
    });

    service.getFilteredFlights().subscribe(filteredFlights => {
      expect(filteredFlights.length).toBe(1);
      expect(filteredFlights[0].flightNumber).toBe('6E202');
      expect(filteredFlights[0].callsign).toBe('IGO202');
      expect(filteredFlights[0].status).toBe('Delayed');
      expect(filteredFlights[0].origin).toBe('Chennai');
      expect(filteredFlights[0].destination).toBe('Kochi');
    });
  })

  it('should load flights successfully', () => {
    service.loadFlights();
    const request = httpMock.expectOne('assets/data/flights.json');
    expect(request.request.method).toBe('GET');
    // Send fake API response
    request.flush(flights);
    
    service.getFlights().subscribe(result => {
      expect(result).toEqual(flights);
      expect(result.length).toBe(3);
    });

    service.getDashboardSummary().subscribe(summary => {
      expect(summary.totalFlights).toBe(3);
      expect(summary.activeFlights).toBe(1);
      expect(summary.delayedFlights).toBe(1);
      expect(summary.arrivedFlights).toBe(1);
    });

    service.getLoader().subscribe(loading => {
      expect(loading).toBeFalse();
    })
  })

  it('should handle error when loading flights fails', () => {
    service.loadFlights();
    const request = httpMock.expectOne('assets/data/flights.json');
    expect(request.request.method).toBe('GET');

    request.flush('Unable to load flights', {
      status: 500,
      statusText: 'Server Error'
    });

    service.getLoader().subscribe(loading => {
      expect(loading).toBeFalse();
    });

    service.error$.subscribe(error => {
      expect(error).toBeTrue();
    })
  })

  it('should calculate dashboard summary correctly', () => {
    service.loadFlights();
    const request = httpMock.expectOne('assets/data/flights.json');
    request.flush(flights);
    
    service.getDashboardSummary().subscribe(summary => {
      expect(summary.totalFlights).toBe(3);
      expect(summary.activeFlights).toBe(1);
      expect(summary.delayedFlights).toBe(1);
      expect(summary.arrivedFlights).toBe(1);
    });
  })

  it('should return all flights when all filters are selected', () => {
    service.loadFlights();
    const request = httpMock.expectOne('assets/data/flights.json');
    request.flush(flights);

    service.applyFilters({
      callsign: '',
      status: 'All',
      origin: 'All',
      destination: 'All'
    });

    service.getFilteredFlights().subscribe(filteredFlights => {
      expect(filteredFlights.length).toBe(3);
      expect(filteredFlights).toEqual(flights);
    });
  })

});
