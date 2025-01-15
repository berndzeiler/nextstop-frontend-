import { Component, EventEmitter, Output } from '@angular/core';
import { StopsService } from '../../services/stops.service';
import { Stop } from '../../models/stop.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, of } from 'rxjs';
import { GpsSearchFormErrorMessages } from '../../helpers/error-message';

@Component({
  selector: 'wea5-gps-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './gps-search.component.html',
  styles: ``
})
export class GpsSearchComponent {
  @Output() stopSelected = new EventEmitter<Stop>();

  gpsForm!: FormGroup;
  foundStops: Stop[] = [];
  currentLatitude: number | null = null;
  currentLongitude: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  errors: { [key: string]: string } = {};

  constructor(private fb: FormBuilder, private stopsService: StopsService) { }

  ngOnInit() {
    this.gpsForm = this.fb.group({
      maxDistanceInKm: [20, [Validators.required, Validators.min(1), Validators.max(100)]],
      maxResults: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.currentLatitude = position.coords.latitude;
        this.currentLongitude = position.coords.longitude;
      },
      (error) => {
        this.errorMessage = 'Standortzugriff fehlgeschlagen. Bitte erlauben Sie den Zugriff.';
      }
    );

    this.gpsForm.statusChanges.subscribe(() => this.updateErrorMessages());
  }

  searchNearbyStops(): void {
    if (this.gpsForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.foundStops = [];

    if (this.currentLatitude === null || this.currentLongitude === null) {
      this.errorMessage = 'Standortdaten konnten nicht ermittelt werden.';
      this.isLoading = false;
      return;
    }

    const { maxDistanceInKm, maxResults } = this.gpsForm.value;

    this.stopsService
      .findNearbyStops(this.currentLatitude, this.currentLongitude, maxDistanceInKm, maxResults)
      .pipe(
        debounceTime(300),
        catchError((err) => {
          this.errorMessage = 'Fehler beim Abrufen der Haltestellen.';
          return of([]);
        })
      )
      .subscribe((stops) => {
        this.foundStops = stops;
        this.isLoading = false;
      });
  }

  selectStop(stop: Stop): void {
    this.stopSelected.emit(stop);
  }

  updateErrorMessages(): void {
    this.errors = {};
    for (const message of GpsSearchFormErrorMessages) {
      const control = this.gpsForm.get(message.forControl);
      if (
        control &&
        control.dirty &&
        control.invalid &&
        control.errors?.[message.forValidator]
      ) {
        this.errors[message.forControl] = message.text;
      }
    }
  }
}
