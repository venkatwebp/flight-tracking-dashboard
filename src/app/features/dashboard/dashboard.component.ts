import { Component, OnInit } from '@angular/core';

import { DashboardSummary } from 'src/app/core/models/dashboard.model';
import { FlightService } from 'src/app/core/services/flight.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboard: DashboardSummary = {
    totalFlights: 0,
    activeFlights: 0,
    delayedFlights: 0,
    arrivedFlights: 0
  };

  loading = false;

  constructor(
    private flightService: FlightService
  ) { }

  ngOnInit(): void {
    this.flightService.loadFlights();
    this.flightService.getDashboardSummary().subscribe({
      next: (summary) => {
        this.dashboard = summary;
      }
    });

    this.flightService.getLoader().subscribe({
      next: (loading) => {
        this.loading = loading;
      }
    })

  }

}