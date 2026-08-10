import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FlightDetailsComponent } from './flight-details.component';
import { FlightService } from 'src/app/core/services/flight.service';

describe('FlightDetailsComponent', () => {
  let component: FlightDetailsComponent;
  let fixture: ComponentFixture<FlightDetailsComponent>;
  const flightServiceMock = {
    getSelectedFlight: jasmine.createSpy('getSelectedFlight')
      .and.returnValue(of(null))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FlightDetailsComponent
      ],
      providers: [
        {
          provide: FlightService,
          useValue: flightServiceMock
        }
      ]
    });

  });

  it('should create', () => {
    fixture = TestBed.createComponent(
      FlightDetailsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set selected flight from service', () => {
    const mockFlight = {
      id: 1,
      flightNumber: '6E202',
      callsign: 'IGO202',
      aircraftType: 'A320',
      origin: 'Chennai',
      originLat: 13.0827,
      originLng: 80.2707,
      destination: 'Kochi',
      destinationLat: 9.9312,
      destinationLng: 76.2673,
      currentLat: 11.5,
      currentLng: 78.2,
      status: 'Active' as const,
      estimatedDeparture: '10:30',
      estimatedArrival: '12:00'
    };

    flightServiceMock.getSelectedFlight.and.returnValue(
      of(mockFlight)
    );

    fixture = TestBed.createComponent(
      FlightDetailsComponent
    );

    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.selectedFlight)
      .toEqual(mockFlight);
  });

  it('should display the selected flight details', () => {
    const mockFlight = {
      id: 1,
      flightNumber: '6E202',
      callsign: 'IGO202',
      aircraftType: 'A320',
      origin: 'Chennai',
      originLat: 13.0827,
      originLng: 80.2707,
      destination: 'Kochi',
      destinationLat: 9.9312,
      destinationLng: 76.2673,
      currentLat: 11.5,
      currentLng: 78.2,
      status: 'Active' as const,
      estimatedDeparture: '10:30',
      estimatedArrival: '12:00'
    };

    flightServiceMock.getSelectedFlight.and.returnValue(
      of(mockFlight)
    );

    fixture = TestBed.createComponent(
      FlightDetailsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.selectedFlight?.flightNumber)
      .toBe('6E202');
    expect(component.selectedFlight?.callsign)
      .toBe('IGO202');
    expect(component.selectedFlight?.origin)
      .toBe('Chennai');
    expect(component.selectedFlight?.destination)
      .toBe('Kochi');
    expect(component.selectedFlight?.aircraftType)
      .toBe('A320');
    expect(component.selectedFlight?.status)
      .toBe('Active');
  });

});