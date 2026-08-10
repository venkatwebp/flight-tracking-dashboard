import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SearchFilterComponent } from './search-filter.component';
import { FlightService } from 'src/app/core/services/flight.service';

describe('SearchFilterComponent', () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;

  const flightServiceMock = {

  getFlights: jasmine.createSpy('getFlights')
    .and.returnValue(
      of([
        {
          id: 1,
          flightNumber: '6E101',
          callsign: 'IGO101',
          aircraftType: 'A320',
          origin: 'Delhi',
          originLat: 28.6,
          originLng: 77.2,
          destination: 'Mumbai',
          destinationLat: 19.0,
          destinationLng: 72.8,
          currentLat: 25,
          currentLng: 75,
          status: 'Active',
          estimatedDeparture: '10:00',
          estimatedArrival: '12:00'
        },
        {
          id: 2,
          flightNumber: '6E202',
          callsign: 'IGO202',
          aircraftType: 'A320',
          origin: 'Chennai',
          originLat: 13.0,
          originLng: 80.2,
          destination: 'Kochi',
          destinationLat: 10.1,
          destinationLng: 76.2,
          currentLat: 12,
          currentLng: 79,
          status: 'Delayed',
          estimatedDeparture: '11:00',
          estimatedArrival: '13:00'
        }
      ])
    ),

  applyFilters: jasmine.createSpy('applyFilters'),
  clearSelectedFlight: jasmine.createSpy('clearSelectedFlight')
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchFilterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FlightService, useValue: flightServiceMock }
      ]
    });
    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filter form with default values', () => {
    expect(component.filterForm).toBeTruthy();
    expect(component.filterForm.value).toEqual({
      callsign: '',
      status: 'All',
      origin: 'All',
      destination: 'All'
    });
  })

  it('should load origin and destination dropdown values', () => {
    expect(component.origins).toEqual(['All', 'Delhi', 'Chennai']);
    expect(component.destinations).toEqual(['All', 'Mumbai', 'Kochi']);
  })

  it('should load flights for dropdown values', () => {
    expect(flightServiceMock.getFlights).toHaveBeenCalled();
  })

  it('should apply filters when form changes', () => {
    component.filterForm.patchValue({
      callsign: 'IGO202'
    })

    expect(flightServiceMock.applyFilters).toHaveBeenCalledWith({
      callsign: 'IGO202',
      status: 'All',
      origin: 'All',
      destination: 'All'
    });
  })

  it('should clear filters and selected flight', () => {
    component.filterForm.patchValue({
      callsign: 'IGO202',
      status: 'Delayed',
      origin: 'Chennai',
      destination: 'Kochi'
    });
    flightServiceMock.applyFilters.calls.reset();
    flightServiceMock.clearSelectedFlight.calls.reset();
    
    component.clearFilters();
    expect(component.filterForm.value).toEqual({
      callsign: '',
      status: 'All',
      origin: 'All',
      destination: 'All'
    });
    expect(flightServiceMock.clearSelectedFlight).toHaveBeenCalled();
  });

});
