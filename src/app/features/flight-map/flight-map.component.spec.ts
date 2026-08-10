import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { FlightMapComponent } from './flight-map.component';
import { FlightService } from 'src/app/core/services/flight.service';


describe('FlightMapComponent', () => {
  let component: FlightMapComponent;
  let fixture: ComponentFixture<FlightMapComponent>;

  const flightServiceMock = {
    getFilteredFlights: jasmine.createSpy('getFilteredFlights')
      .and.returnValue(of([])),
    getSelectedFlight: jasmine.createSpy('getSelectedFlight')
      .and.returnValue(of(null)),
    selectFlight: jasmine.createSpy('selectFlight')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FlightMapComponent
      ],
      providers: [
        {
          provide: FlightService,
          useValue: flightServiceMock
        }
      ]
    });

    fixture = TestBed.createComponent(FlightMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive filtered flights from FlightService', () => {
    const mockFlights = [
      {
        id: 1,
        flightNumber: 'AI101',
        callsign: 'AIC101',
        aircraftType: 'A320',
        origin: 'DEL',
        originLat: 28.61,
        originLng: 77.20,
        destination: 'BOM',
        destinationLat: 19.07,
        destinationLng: 72.87,
        currentLat: 23.84,
        currentLng: 75.04,
        status: 'Active' as const,
        estimatedDeparture: '10:00',
        estimatedArrival: '12:00'
      }
    ];

    flightServiceMock.getFilteredFlights.and.returnValue(
      of(mockFlights)
    );

    fixture = TestBed.createComponent(FlightMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.flights).toEqual(mockFlights);
  });

  it('should receive selected flight from FlightService', () => {
    const mockFlight = {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'DEL',
      originLat: 28.61,
      originLng: 77.20,
      destination: 'BOM',
      destinationLat: 19.07,
      destinationLng: 72.87,
      currentLat: 24,
      currentLng: 75,
      status: 'Active' as const,
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    };

    flightServiceMock.getSelectedFlight.and.returnValue(
      of(mockFlight)
    );

    fixture = TestBed.createComponent(FlightMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.selectedFlight).toEqual(mockFlight);
  });

  it('should start flight animation when playFlight is called', fakeAsync(() => {
    const mockFlight = {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'DEL',
      originLat: 28.61,
      originLng: 77.20,
      destination: 'BOM',
      destinationLat: 19.07,
      destinationLng: 72.87,
      currentLat: 24,
      currentLng: 75,
      status: 'Active' as const,
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    };

    component.selectedFlight = mockFlight;
    component.playFlight();
    expect(component.isPlaying).toBeTrue();
    tick(1000);
    expect(component.isPlaying).toBeTrue();
    component.pauseFlight();
    expect(component.isPlaying).toBeFalse();
  }));

  it('should pause flight animation when pauseFlight is called', fakeAsync(() => {
    const mockFlight = {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'DEL',
      originLat: 28.61,
      originLng: 77.20,
      destination: 'BOM',
      destinationLat: 19.07,
      destinationLng: 72.87,
      currentLat: 24,
      currentLng: 75,
      status: 'Active' as const,
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    };

    component.selectedFlight = mockFlight;
    component.playFlight();
    expect(component.isPlaying).toBeTrue();
    component.pauseFlight();
    expect(component.isPlaying).toBeFalse();
  })
  );

  it('should reset flight animation', fakeAsync(() => {
    const mockFlight = {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'DEL',
      originLat: 28.61,
      originLng: 77.20,
      destination: 'BOM',
      destinationLat: 19.07,
      destinationLng: 72.87,
      currentLat: 24,
      currentLng: 75,
      status: 'Active' as const,
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    };

    component.selectedFlight = mockFlight;
    component.playFlight();
    expect(component.isPlaying).toBeTrue();
    component.resetFlight();
    expect(component.isPlaying).toBeFalse();
  }));

  it('should not start animation when no flight is selected', () => {
    component.selectedFlight = null;
    component.playFlight();
    expect(component.isPlaying).toBeFalse();
  });

  it('should not start animation again when flight is already playing', () => {
    component.isPlaying = true;
    component.playFlight();
    expect(component.isPlaying).toBeTrue();
  })

  it('should safely pause when flight is already paused', () => {
    component.isPlaying = false;
    component.pauseFlight();
    expect(component.isPlaying).toBeFalse();
  });

  it('should reset flight when animation is already stopped', () => {
    component.isPlaying = false;
    component.resetFlight();
    expect(component.isPlaying).toBeFalse();
  });

  it('should clear selected flight when service emits null', () => {
    flightServiceMock.getSelectedFlight.and.returnValue(of(null));
    fixture = TestBed.createComponent(FlightMapComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.selectedFlight).toBeNull();
  });

  it('should update selectedFlight when a flight is assigned', () => {
    const mockFlight = {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'DEL',
      originLat: 28.61,
      originLng: 77.20,
      destination: 'BOM',
      destinationLat: 19.07,
      destinationLng: 72.87,
      currentLat: 24,
      currentLng: 75,
      status: 'Active' as const,
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    };

    component.selectedFlight = mockFlight;
    expect(component.selectedFlight).toEqual(mockFlight);
  });

  it('should update aircraft position based on animation progress', () => {
    const mockFlight = {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'DEL',
      originLat: 28.61,
      originLng: 77.20,
      destination: 'BOM',
      destinationLat: 19.07,
      destinationLng: 72.87,
      currentLat: 28.61,
      currentLng: 77.20,
      status: 'Active' as const,
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    };

    // Assign selected flight AFTER component initialization
    component.selectedFlight = mockFlight;
    // Set animation progress to 50%
    (component as any).animationProgress = 0.5;
    // Run position calculation
    (component as any).updateAircraftPosition();

    // Expected halfway position
    const expectedLat = 28.61 + (19.07 - 28.61) * 0.5;
    const expectedLng = 77.20 + (72.87 - 77.20) * 0.5;

    expect(component.selectedFlight?.currentLat).toBeCloseTo(expectedLat, 2);
    expect(component.selectedFlight?.currentLng).toBeCloseTo(expectedLng, 2);
  });

  it('should place aircraft at destination when animation progress is 1', () => {
    const mockFlight = {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'DEL',
      originLat: 28.61,
      originLng: 77.20,
      destination: 'BOM',
      destinationLat: 19.07,
      destinationLng: 72.87,
      currentLat: 28.61,
      currentLng: 77.20,
      status: 'Active' as const,
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    };

    component.selectedFlight = mockFlight;
    // Animation completed
    (component as any).animationProgress = 1;
    (component as any).updateAircraftPosition();
    expect(component.selectedFlight?.currentLat).toBeCloseTo(mockFlight.destinationLat, 2);
    expect(component.selectedFlight?.currentLng).toBeCloseTo(mockFlight.destinationLng, 2);
  });

  it('should restart animation when flight has already completed', () => {
    const mockFlight = {
      id: 1,
      flightNumber: 'AI101',
      callsign: 'AIC101',
      aircraftType: 'A320',
      origin: 'DEL',
      originLat: 28.61,
      originLng: 77.20,
      destination: 'BOM',
      destinationLat: 19.07,
      destinationLng: 72.87,
      currentLat: 19.07,
      currentLng: 72.87,
      status: 'Active' as const,
      estimatedDeparture: '10:00',
      estimatedArrival: '12:00'
    };

    component.selectedFlight = mockFlight;
    // Simulate completed animation
    (component as any).animationProgress = 1;
    component.isPlaying = false;
    component.playFlight();

    // It should restart from the beginning
    expect((component as any).animationProgress).toBe(0);
    // Play should now be active
    expect(component.isPlaying).toBeTrue();
    // Clean up interval created by playFlight()
    component.pauseFlight();
  });

});