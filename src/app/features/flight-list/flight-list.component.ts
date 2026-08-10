import { Component, OnInit } from '@angular/core';

import { Flight } from 'src/app/core/models/flight.model';
import { FlightService } from 'src/app/core/services/flight.service';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent implements OnInit {

  flights: Flight[] = [];

  selectedFlight: Flight | null = null;

  // Sorting
  sortColumn: keyof Flight | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;

  pageSize = 10;

  pageSizeOptions = [10, 25, 50];

  totalPages = 1;


  constructor(
    private flightService: FlightService
  ) { }


  ngOnInit(): void {

    this.flightService.getFilteredFlights().subscribe({

      next: (flights) => {

        this.flights = [...flights];

        // Re-apply sorting
        if (this.sortColumn) {
          this.sortFlights();
        }

        // Reset to first page when filter results change
        this.currentPage = 1;

        this.updateTotalPages();

      }

    });


    this.flightService.getSelectedFlight().subscribe({

      next: (flight) => {

        this.selectedFlight = flight;

      }

    });

  }


  selectFlight(flight: Flight): void {

    this.selectedFlight = flight;

    this.flightService.selectFlight(flight);

  }


  // --------------------------------
  // Sorting
  // --------------------------------

  sort(column: keyof Flight): void {

    if (this.sortColumn === column) {

      this.sortDirection =
        this.sortDirection === 'asc'
          ? 'desc'
          : 'asc';

    } else {

      this.sortColumn = column;

      this.sortDirection = 'asc';

    }

    this.sortFlights();

    // After sorting, show first page
    this.currentPage = 1;

  }


  private sortFlights(): void {

    if (!this.sortColumn) {
      return;
    }

    const column = this.sortColumn;

    this.flights.sort((a, b) => {

      const valueA = String(a[column] ?? '').toLowerCase();

      const valueB = String(b[column] ?? '').toLowerCase();

      const comparison =
        valueA.localeCompare(
          valueB,
          undefined,
          {
            numeric: true,
            sensitivity: 'base'
          }
        );

      return this.sortDirection === 'asc'
        ? comparison
        : -comparison;

    });

  }


  getSortIcon(column: keyof Flight): string {

    if (this.sortColumn !== column) {
      return '↕';
    }

    return this.sortDirection === 'asc'
      ? '↑'
      : '↓';

  }


  // --------------------------------
  // Pagination
  // --------------------------------

  get paginatedFlights(): Flight[] {

    const startIndex =
      (this.currentPage - 1) * this.pageSize;

    const endIndex =
      startIndex + this.pageSize;

    return this.flights.slice(
      startIndex,
      endIndex
    );

  }


  updateTotalPages(): void {

    this.totalPages =
      Math.max(
        1,
        Math.ceil(
          this.flights.length / this.pageSize
        )
      );

  }


  changePageSize(): void {

    this.currentPage = 1;

    this.updateTotalPages();

  }


  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

  }


  previousPage(): void {

    this.goToPage(
      this.currentPage - 1
    );

  }


  nextPage(): void {

    this.goToPage(
      this.currentPage + 1
    );

  }


  get pageNumbers(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );

  }


  get startItem(): number {

    if (this.flights.length === 0) {
      return 0;
    }

    return (
      (this.currentPage - 1) *
      this.pageSize
    ) + 1;

  }


  get endItem(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.flights.length
    );

  }

}