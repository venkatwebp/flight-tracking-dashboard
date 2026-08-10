import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import * as L from 'leaflet';
import { Flight } from 'src/app/core/models/flight.model';
import { FlightService } from 'src/app/core/services/flight.service';

@Component({
  selector: 'app-flight-map',
  templateUrl: './flight-map.component.html',
  styleUrls: ['./flight-map.component.scss']
})
export class FlightMapComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private flightLayer = L.layerGroup();
  private airportLayer = L.layerGroup();
  private routeLayer = L.layerGroup();

  private selectedRoute?: L.Polyline;
  private destroyRef = inject(DestroyRef);

  flights: Flight[] = [];
  selectedFlight: Flight | null = null;
  private animationTimer?: ReturnType<typeof setInterval>;
  isPlaying = false;
  private animationProgress = 0;
  private selectedAircraftMarker?: L.Marker;

  constructor(
    private flightService: FlightService
  ) {}

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.initializeMap();
    }, 100);

  }

  ngOnInit(): void {

    this.flightService.getFilteredFlights()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: (flights) => {

        console.log('Flights Loaded:', flights);

        this.flights = flights;

        if (this.map) {
          this.addFlightMarkers();
        }

      }
    });

    this.flightService.getSelectedFlight()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: (flight) => {
        this.stopAnimation();
        this.selectedFlight = flight;
        this.animationProgress = 0;

        if(flight){
          flight.currentLat = flight.originLat;
          flight.currentLng = flight.originLng;
        }

        if (!this.map) {
          return;
        }

        if(!flight){
          this.routeLayer.clearLayers();
          this.airportLayer.clearLayers();
          this.selectedRoute = undefined;
          this.selectedAircraftMarker = undefined;
          return;
        }

        this.addFlightMarkers();
        this.drawAirportMarkers(flight);
        this.drawRoute(flight);
        this.fitFlightRoute();

      }

    });

  }

  private initializeMap(): void {

    this.map = L.map(this.mapContainer.nativeElement);

    this.map.setView([20.5937, 78.9629], 5);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    this.flightLayer.addTo(this.map);
    this.airportLayer.addTo(this.map);
    this.routeLayer.addTo(this.map);

    this.map.whenReady(() => {

      setTimeout(() => {

        this.map.invalidateSize();

        if (this.flights.length) {
          this.addFlightMarkers();
        }

      }, 100);

    });

  }

  private addFlightMarkers(): void {

    this.flightLayer.clearLayers();
    this.selectedAircraftMarker = undefined;

    this.flights.forEach((flight) => {

      const marker = L.marker(
        this.getCurrentFlightPosition(flight),
        {
          icon: this.createAircraftIcon(
            this.calculateBearing(flight)
          ),
          zIndexOffset: 1000
        }
      );

  if (this.selectedFlight && this.selectedFlight.flightNumber === flight.flightNumber) {
      this.selectedAircraftMarker = marker;
  }

      marker.bindPopup(`
        <strong>${flight.flightNumber}</strong><br>
        ${flight.callsign}<br>
        ${flight.origin} ➜ ${flight.destination}<br>
        Status: ${flight.status}
      `);

      marker.on('click', () => {

        console.log('Marker clicked:', flight);

        this.flightService.selectFlight(flight);

      });

      marker.addTo(this.flightLayer);

    });

  }

  private loadTileLayer(): void {

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

  }

  private createAircraftIcon(angle = 0): L.DivIcon {

    return L.divIcon({

      html: `
        <div class="aircraft-marker">
          <svg
            class="aircraft-svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            style="transform: rotate(${angle}deg);"
            xmlns="http://www.w3.org/2000/svg">

            <path
              d="M21 16v-2l-8-5V3.5
                C13 2.67 12.33 2 11.5 2
                S10 2.67 10 3.5V9
                l-8 5v2l8-2.5V19
                l-2 1.5V22l3.5-1
                3.5 1v-1.5L13 19v-5.5L21 16z"
              fill="currentColor"
            />

          </svg>
        </div>
      `,

      className: 'aircraft-icon-wrapper',

      iconSize: [36, 36],

      iconAnchor: [24, 24]

    });

  }

  private calculateBearing(flight: Flight): number {
    return Math.atan2(
      flight.destinationLng - flight.originLng,
      flight.destinationLat - flight.originLat
    ) * 180 / Math.PI;

  }

  private drawAirportMarkers(flight: Flight): void {

    this.airportLayer.clearLayers();

    L.circleMarker(
      [flight.originLat, flight.originLng],
      {
        radius: 7,
        color: '#2ecc71',
        fillColor: '#2ecc71',
        fillOpacity: 1
      }
    )
    .bindTooltip(`Origin Airport <br>
    <b>${flight.origin}</b>
    `)
    .addTo(this.airportLayer);

    L.circleMarker(
      [flight.destinationLat, flight.destinationLng],
      {
        radius: 7,
        color: '#e74c3c',
        fillColor: '#e74c3c',
        fillOpacity: 1
      }
    )
    .bindTooltip(`Destination Airport
    <br>
    <b>${flight.destination}</b>
    `)
    .addTo(this.airportLayer);

  }

  private drawRoute(flight: Flight): void {

    this.routeLayer.clearLayers();

    const start: L.LatLngExpression = [
      flight.originLat,
      flight.originLng
    ];

    const middle: L.LatLngExpression = [
      (flight.originLat + flight.destinationLat) / 2,
      (flight.originLng + flight.destinationLng) / 2
    ];

    const end: L.LatLngExpression = [
      flight.destinationLat,
      flight.destinationLng
    ];

    this.selectedRoute = L.polyline(
      [
        start,
        middle,
        end
      ],
      {
        color: '#1976d2',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }
    );

    this.selectedRoute.addTo(this.routeLayer);

  }

  private fitFlightRoute(): void {

    if (!this.selectedRoute) {
      return;
    }

    this.map.fitBounds(
      this.selectedRoute.getBounds(),
      {
        padding: [100, 100],
        maxZoom: 6
      }
    );

  }

  private getCurrentFlightPosition(
      flight: Flight
    ): L.LatLngExpression {

      return [
        flight.currentLat,
        flight.currentLng
      ];

    }

  playFlight(): void {
    if (!this.selectedFlight || this.isPlaying) {
      return;
    }
    // If animation already completed, restart from beginning
    if (this.animationProgress >= 1) {
      this.animationProgress = 0;
      this.updateAircraftPosition();
    }

    this.isPlaying = true;
    this.animationTimer = setInterval(() => {
    this.animationProgress += 0.01;

      if (this.animationProgress >= 1) {
        this.animationProgress = 1;
        this.updateAircraftPosition();
        this.stopAnimation();
        return;
      }

      this.updateAircraftPosition();

    }, 100);
  }

  pauseFlight(): void {
    this.stopAnimation();
  }

  resetFlight(): void {
    this.stopAnimation();
    this.animationProgress = 0;
    this.updateAircraftPosition();
  }

  private stopAnimation(): void {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = undefined;
    }
    this.isPlaying = false;
  }

  private updateAircraftPosition(): void {
    if (!this.selectedFlight) {
      return;
    }

    const flight = this.selectedFlight;

    const lat =
      flight.originLat +
      (flight.destinationLat - flight.originLat) *
      this.animationProgress;

    const lng =
      flight.originLng +
      (flight.destinationLng - flight.originLng) *
      this.animationProgress;

    flight.currentLat = lat;
    flight.currentLng = lng;
    this.updateSelectedAircraftMarker();
  }

  private updateSelectedAircraftMarker(): void {
    if (!this.selectedFlight) {
      return;
    }

    const position = this.getCurrentFlightPosition(
      this.selectedFlight
    );

    console.log('Animation position:', position, 'Marker:', this.selectedAircraftMarker);

    if (!this.selectedAircraftMarker) {
      return;
    }
    this.selectedAircraftMarker.setLatLng(position);
  }

}
