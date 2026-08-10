import { Component, OnInit } from '@angular/core';

import { Flight } from 'src/app/core/models/flight.model';
import { FlightService } from 'src/app/core/services/flight.service';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit {

  selectedFlight: Flight | null = null;

  constructor(
    private flightService: FlightService
  ) {}

  ngOnInit(): void {

    this.flightService.getSelectedFlight().subscribe({
      next: (flight) => {
        console.log('Received Flight:', flight);
        this.selectedFlight = flight;
      }
    });

  }

}