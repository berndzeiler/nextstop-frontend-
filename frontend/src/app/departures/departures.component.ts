import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartureService } from '../services/departure.service';
import { Departure } from '../models/departure.model';
import { StopSearchComponent } from '../stop-search/stop-search.component';
import { SelectedStopDisplayComponent } from '../selected-stop-display/selected-stop-display.component';
import { Stop } from '../models/stop.model';
import { DepartureFormErrorMessages } from '../helpers/error-message';
import { GpsModalComponent } from '../gps-modal/gps-modal.component';

@Component({
  selector: 'wea5-departures',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StopSearchComponent,
    SelectedStopDisplayComponent,
    GpsModalComponent
  ],
  templateUrl: './departures.component.html',
})
export class DeparturesComponent implements OnInit {
  departureForm!: FormGroup;
  departures: Departure[] = [];
  errorMessage: string | null = null;
  noDeparturesMessage: string | null = null;
  isLoading = false;
  selectedStop: Stop | null = null;
  errors: { [key: string]: string } = {};

  @ViewChild('gpsModal') gpsModal!: GpsModalComponent;

  constructor(
    private fb: FormBuilder,
    private departureService: DepartureService
  ) { }

  ngOnInit(): void {
    const currentDate = this.getCurrentDate();
    const currentTime = this.getCurrentTime();

    this.departureForm = this.fb.group({
      stopShortName: ['', Validators.required],
      date: [currentDate, Validators.required],
      time: [currentTime, Validators.required],
      connections: [3, [Validators.required, Validators.min(1)]],
    });

    this.departureForm.statusChanges.subscribe(() => this.updateErrorMessages());
  }

  onStopSelected(stop: Stop) {
    // Triggered by the normal search field
    this.departureForm.get('stopShortName')?.setValue(stop.shortName);
    this.selectedStop = stop;
  }

  searchDepartures() {
    if (this.departureForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.noDeparturesMessage = null;
    this.departures = [];

    const { stopShortName, date, time, connections } = this.departureForm.value;
    const dateTime = this.combineDateAndTime(date, time);

    this.departureService.getNextDepartures(stopShortName, dateTime, connections)
      .subscribe({
        next: (departures) => {
          this.departures = departures;
          this.isLoading = false;
        },
        error: (err) => {
          if (err.status === 404) {
            this.noDeparturesMessage = 'Keine Abfahrten gefunden.';
          } else {
            this.errorMessage = 'Fehler beim Abrufen der Abfahrten.';
          }
          this.isLoading = false;
        }
      });
  }

  private getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().split(':').slice(0, 2).join(':');
  }

  private combineDateAndTime(date: string, time: string): string {
    return `${date}T${time}:00`;
  }

  formatTimeWithDelay(time: string, delayInMinutes: number): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + delayInMinutes);

    const delayedHours = date.getHours().toString().padStart(2, '0');
    const delayedMinutes = date.getMinutes().toString().padStart(2, '0');
    return `${delayedHours}:${delayedMinutes}`;
  }

  updateErrorMessages(): void {
    this.errors = {};

    for (const message of DepartureFormErrorMessages) {
      const control = this.departureForm.get(message.forControl);
      if (
        control &&
        control.dirty &&
        control.invalid &&
        control.errors != null &&
        control.errors[message.forValidator] &&
        !this.errors[message.forControl]
      ) {
        this.errors[message.forControl] = message.text;
      }
    }
  }
}
