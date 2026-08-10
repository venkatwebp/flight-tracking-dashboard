import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FlightService } from 'src/app/core/services/flight.service';
import { FlightFilter } from 'src/app/core/models/flight-filter.model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {

  filterForm!: FormGroup;

  statuses: string[] = [
    'All',
    'Active',
    'Delayed',
    'Arrived'
  ];

  origins: string[] = [];

  destinations: string[] = [];

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService
  ) { }

  ngOnInit(): void {

    this.buildForm();

    this.loadDropdownValues();

    this.subscribeToFilters();

  }

  private buildForm(): void {

    this.filterForm = this.fb.group({

      callsign: [''],

      status: ['All'],

      origin: ['All'],

      destination: ['All']

    });

  }

  private loadDropdownValues(): void {

    this.flightService.getFlights().subscribe({

      next: (flights) => {

        this.origins = [
          'All',
          ...new Set(flights.map(f => f.origin))
        ];

        this.destinations = [
          'All',
          ...new Set(flights.map(f => f.destination))
        ];

      }

    });

  }

  private subscribeToFilters(): void {

    this.filterForm.valueChanges.subscribe(value => {

      this.flightService.applyFilters(value as FlightFilter);

    });
  }

  clearFilters(): void {
    this.filterForm.reset({
      callsign: '',
      status: 'All',
      origin: 'All',
      destination: 'All'
    });

    this.flightService.clearSelectedFlight();
  }

}