import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FlightService } from 'src/app/core/services/flight.service';
import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const flightServiceMock = {
    loadFlights: jasmine.createSpy('loadFlights'),
    getDashboardSummary: jasmine.createSpy('getDashboardSummary').and.returnValue(of({
      totalFlights: 10,
      activeFlights: 5,
      delayedFlights: 3,
      arrivedFlights: 2
    })),
    getLoader: jasmine.createSpy('getLoader').and.returnValue(of(false))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: FlightService, useValue: flightServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load flights on initialization', () => {
    expect(flightServiceMock.loadFlights).toHaveBeenCalled();
  })

  it('should update dashboard summary', () => {
    expect(component.dashboard.totalFlights).toBe(10);
    expect(component.dashboard.activeFlights).toBe(5);
    expect(component.dashboard.delayedFlights).toBe(3);
    expect(component.dashboard.arrivedFlights).toBe(2);
  })

  it('should update loading state', () => {
    expect(component.loading).toBe(false);
  })


});
