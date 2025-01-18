import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TripPlannerService } from '../services/trip-planner.service';
import { StopSearchComponent } from '../stop-search/stop-search.component';
import { Schedule } from '../models/schedule';
import { TripPlannerFormErrorMessages } from '../helpers/error-message';
import { Stop } from '../models/stop.model';
import { SelectedStopDisplayComponent } from '../selected-stop-display/selected-stop-display.component';
import { uniqueStopsValidator } from '../helpers/validators/unique-stops-validator.directive';
import { GpsModalComponent } from '../gps-modal/gps-modal.component';

@Component({
  selector: 'wea5-trip-planner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StopSearchComponent,
    SelectedStopDisplayComponent,
    GpsModalComponent
  ],
  templateUrl: './trip-planner.component.html',
})
export class TripPlannerComponent implements OnInit {
  tripForm!: FormGroup;
  schedules: Schedule[] = [];
  errorMessage: string | null = null;
  noConnectionsMessage: string | null = null;
  isLoading = false;
  errors: { [key: string]: string } = {};
  selectedStartStop: Stop | null = null;
  selectedEndStop: Stop | null = null;

  @ViewChild('startGpsModal') startGpsModal!: GpsModalComponent;
  @ViewChild('endGpsModal') endGpsModal!: GpsModalComponent;

  constructor(
    private fb: FormBuilder,
    private tripPlannerService: TripPlannerService
  ) { }

  ngOnInit(): void {
    const currentDate = this.getCurrentDate();
    const currentTime = this.getCurrentTime();

    this.tripForm = this.fb.group({
      startStop: ['', Validators.required],
      endStop: ['', Validators.required],
      date: [currentDate, Validators.required],
      time: [currentTime, Validators.required],
      connections: [3, [Validators.required, Validators.min(1)]],
      isArrival: [false],
    },
    { validators: uniqueStopsValidator() }
  );

    this.tripForm.valueChanges.subscribe(() => this.updateErrorMessages());
  }

  onStopSelected(controlName: string, stop: Stop) {
    this.tripForm.get(controlName)?.setValue(stop.shortName);

    if (controlName === 'startStop') {
      this.selectedStartStop = stop;
    } else if (controlName === 'endStop') {
      this.selectedEndStop = stop;
    }

    this.updateErrorMessages();
  }

  onGpsStopSelected(controlName: string, stop: Stop): void {
    this.onStopSelected(controlName, stop);

    if (controlName === 'startStop') {
      this.startGpsModal.closeModal();
    } else if (controlName === 'endStop') {
      this.endGpsModal.closeModal();
    }
  }

  searchSchedules() {
    if (this.tripForm.invalid) {
      this.updateErrorMessages();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.noConnectionsMessage = null;

    const { startStop, endStop, date, time, connections, isArrival } = this.tripForm.value;
    const dateTime = this.combineDateAndTime(date, time);

    this.tripPlannerService.getSchedules(startStop, endStop, dateTime, connections, isArrival)
      .subscribe({
        next: (schedules) => {
          this.schedules = schedules.map(schedule => ({
            ...schedule,
            delayInMinutesStartStop: schedule.delayInMinutesStartStop,
            delayInMinutes: schedule.delayInMinutesEndStop
          }));
          this.isLoading = false;
          this.noConnectionsMessage = null;
        },
        error: (err) => {
          if (err.status === 404) {
            // Handling for 404NotFound
            this.noConnectionsMessage = 'Keine Verbindungen gefunden.';
            this.schedules = [];
          } else {
            // General error handling
            this.errorMessage = 'Fehler beim Abrufen der Verbindungen.';
          }
          this.isLoading = false;
        },
      });
  }

  private getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${date}`;
  }

  private getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private combineDateAndTime(date: string, time: string): string {
    return `${date}T${time}:00`;
  }

  updateErrorMessages(): void {
    this.errors = {};

    for (const message of TripPlannerFormErrorMessages) {
      const control = this.tripForm.get(message.forControl);
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

    // Custom validation for same start-/endstop
    if (this.tripForm.errors?.['sameStops']) {
      this.errors['endStop'] = 'Start- und Ziel-Haltestelle dürfen nicht identisch sein.';
    }
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  formatTimeWithDelay(time: string, delayInMinutes: number): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + delayInMinutes);
  
    const delayedHours = date.getHours().toString().padStart(2, '0');
    const delayedMinutes = date.getMinutes().toString().padStart(2, '0');
    return `${delayedHours}:${delayedMinutes}`;
  }
}
