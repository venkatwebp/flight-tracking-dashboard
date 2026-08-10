import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { FlightListComponent } from './flight-list.component';
import { FlightService } from 'src/app/core/services/flight.service';
import { Flight } from 'src/app/core/models/flight.model';

describe('FlightListComponent', () => {
  let component: FlightListComponent;
  let fixture: ComponentFixture<FlightListComponent>;

  const mockFlights: Flight[] = [
    {
      id: 1,
      flightNumber: '6E202',
      callsign: 'IGO202',
      aircraftType: 'A320',
      origin: 'Chennai',
      originLat: 13.08,
      originLng: 80.27,
      destination: 'Kochi',
      destinationLat: 9.93,
      destinationLng: 76.27,
      currentLat: 11.5,
      currentLng: 78.2,
      status: 'Delayed',
      estimatedDeparture: '10:30',
      estimatedArrival: '12:00'
    },
    {
      id: 2,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'B787',
      origin: 'Delhi',
      originLat: 28.61,
      originLng: 77.20,
      destination: 'Mumbai',
      destinationLat: 19.07,
      destinationLng: 72.87,
      currentLat: 25,
      currentLng: 75,
      status: 'Active',
      estimatedDeparture: '09:00',
      estimatedArrival: '11:00'
    },
    {
      id: 3,
      flightNumber: '6E303',
      callsign: 'IGO303',
      aircraftType: 'A321',
      origin: 'Hyderabad',
      originLat: 17.38,
      originLng: 78.48,
      destination: 'Bangalore',
      destinationLat: 12.97,
      destinationLng: 77.59,
      currentLat: 15,
      currentLng: 78,
      status: 'Arrived',
      estimatedDeparture: '08:00',
      estimatedArrival: '10:00'
    }
  ];

  const mockFlightService = {
    getFilteredFlights: jasmine.createSpy('getFilteredFlights').and.returnValue(of(mockFlights)),
    getSelectedFlight: jasmine.createSpy('getSelectedFlight').and.returnValue(of(null)),
    selectFlight: jasmine.createSpy('selectFlight'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FlightListComponent],
      providers: [
        { provide: FlightService, useValue: mockFlightService }
      ]
    });
    fixture = TestBed.createComponent(FlightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load filtered flights from the service', () => {
    expect(component.flights).toEqual(mockFlights);
  });

  it('should calculate total pages correctly', () => {
    expect(component.totalPages).toBe(1);
  });

  it('should sort flights by origin in ascending order', () => {
    component.sort('origin');
    expect(component.flights.map(f => f.origin)).toEqual(['Chennai', 'Delhi', 'Hyderabad']);
  });

  it('should sort flights by origin in descending order', () => {
    component.sort('origin');
    component.sort('origin'); // Toggle to descending
    expect(component.flights.map(f => f.origin)).toEqual(['Hyderabad', 'Delhi', 'Chennai']);
  });

  it('should show default sort icon when column is not sorted', () => {
    expect(component.getSortIcon('origin')).toBe('↕');
  })

  it('should show ascending sort icon', () => {
    component.sort('origin');
    expect(component.getSortIcon('origin')).toBe('↑');
  })

  it('should show descending sort icon', () => {
    component.sort('origin');
    component.sort('origin'); // Toggle to descending
    expect(component.getSortIcon('origin')).toBe('↓');
  });

  it('should return flights for the current page', () => {
    component.flights = Array.from(
      {length: 25},
      (_, i) => ({
        ...mockFlights[0],
        id: i + 1,
        flightNumber: `Flight${i + 1}`,
      })
    );
    component.pageSize = 10;
    component.currentPage = 1;
    component.updateTotalPages();

    expect(component.totalPages).toBe(3);
    expect(component.paginatedFlights.length).toBe(10);
  })

  it('should move to the next page', () => {
    component.flights = Array.from(
      {length: 25},
      (_, i) => ({
        ...mockFlights[0],
        id: i + 1,
        flightNumber: `Flight${i + 1}`,
      })
    );
    component.updateTotalPages();
    component.nextPage();
    expect(component.currentPage).toBe(2);
  })

  it('should move to the previous page', () => {
    component.flights = Array.from(
      {length: 25},
      (_, i) => ({
        ...mockFlights[0],
        id: i + 1,
        flightNumber: `Flight${i + 1}`,
      })
    );
    component.updateTotalPages();
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should reset to first page when page size changes', () => {
    component.flights = Array.from(
      {length: 25},
      (_, i) => ({
        ...mockFlights[0],
        id: i + 1
      })
    );
    component.currentPage = 2;
    component.pageSize = 25;
    component.changePageSize();
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(1);
  })

  it('should select a flightand notify the service', () => {
    const flight = mockFlights[0];
    component.selectFlight(flight);
    expect(component.selectedFlight).toEqual(flight);
    expect(mockFlightService.selectFlight).toHaveBeenCalledWith(flight);
  })

});
