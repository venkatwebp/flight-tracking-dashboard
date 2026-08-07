import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightMapComponent } from './flight-map.component';

describe('FlightMapComponent', () => {
  let component: FlightMapComponent;
  let fixture: ComponentFixture<FlightMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlightMapComponent]
    });
    fixture = TestBed.createComponent(FlightMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
