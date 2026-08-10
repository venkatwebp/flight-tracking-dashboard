import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FlightMapComponent } from './features/flight-map/flight-map.component';
import { FlightDetailsComponent } from './features/flight-details/flight-details.component';
import { FlightListComponent } from './features/flight-list/flight-list.component';
import { SearchFilterComponent } from './features/search-filter/search-filter.component';
import { KpiCardComponent } from './shared/components/kpi-card/kpi-card.component';
import { StatusChipComponent } from './shared/components/status-chip/status-chip.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    FlightMapComponent,
    FlightDetailsComponent,
    FlightListComponent,
    SearchFilterComponent,
    KpiCardComponent,
    StatusChipComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
