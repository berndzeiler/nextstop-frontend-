import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { RoutesService } from '../../../services/routes.service';
import { DailyValidityTranslations, DailyValidity } from '../../../models/route.model';
import { RouteConnectStop, RouteConnectStopForCreation } from '../../../models/route-connect-stop.model';
import { Stop } from '../../../models/stop.model';
import { CommonModule } from '@angular/common';
import { RouteFormErrorMessages } from '../../../helpers/error-message';
import { StopSearchComponent } from '../../../stop-search/stop-search.component';
import { dateRangeValidator } from '../../../helpers/validators/date-range-validator.directive';
import { SelectedStopDisplayComponent } from '../../../stop-search/selected-stop-display/selected-stop-display.component';

@Component({
  selector: 'wea5-holiday-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StopSearchComponent,
    SelectedStopDisplayComponent,
    FormsModule
  ],
  templateUrl: './route-form.component.html',
  styles: ``
})
export class RouteFormComponent implements OnInit {
  routeForm!: FormGroup;
  dailyValidityOptions = Object.entries(DailyValidityTranslations);
  errors: { [key: string]: string } = {};
  selectedStop: Stop | null = null;
  sortedStops: RouteConnectStop[] = [];

  @ViewChild(StopSearchComponent, { static: true }) stopSearchComponent!: StopSearchComponent;

  constructor(
    private fb: FormBuilder,
    private routesService: RoutesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.routeForm = this.fb.group(
      {
        startDate: ['2025-01-01', Validators.required],
        endDate: ['2025-12-31', Validators.required],
        dailyValidity: ['AllDays', Validators.required],
        departureTime: ['06:00:00', Validators.required],
        stops: this.fb.array([])
      },
      { validators: dateRangeValidator() }
    );

    this.routeForm.statusChanges.subscribe(() => this.updateErrorMessages());
  }

  get stops(): FormArray {
    return this.routeForm.get('stops') as FormArray;
  }

  addStopFromSearch(stop: Stop) {
    this.selectedStop = stop;

    // Clear duplicate stop error when a new stop is selected
    this.errors['stops'] = '';

    if (this.stopSearchComponent) {
      this.stopSearchComponent.foundStops = [];
      this.stopSearchComponent.isLoading = false;
    }
  }

  addStopToRoute() {
    const departureTime = this.routeForm.get('departureTime')?.value;

    if (this.selectedStop && departureTime) {
      const normalizedTime = departureTime.length === 5 ? `${departureTime}:00` : departureTime;

      // Check for duplicates
      const isDuplicate = this.sortedStops.some(
        (stop) => stop.shortName === this.selectedStop?.shortName
      );
      if (isDuplicate) {
        this.errors['stops'] = 'Diese Haltestelle wurde bereits hinzugefügt.';
        return;
      }

      this.sortedStops.push({
        shortName: this.selectedStop.shortName,
        name: this.selectedStop.name,
        latitude: this.selectedStop.latitude,
        longitude: this.selectedStop.longitude,
        departureTime: normalizedTime,
      });
      this.sortedStops.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

      this.selectedStop = null;
      this.routeForm.get('departureTime')?.setValue('06:00:00');
    }
  }

  removeStop(index: number): void {
    this.sortedStops.splice(index, 1);
  }

  saveRoute(): void {
    if (this.routeForm.valid) {
      const routeData = {
        startDate: this.routeForm.get('startDate')?.value,
        endDate: this.routeForm.get('endDate')?.value,
        dailyValidity: this.routeForm.get('dailyValidity')?.value,
        stops: this.sortedStops,
      };

      const payload = this.createRouteWithStopsPayload(routeData);
      console.log('Generated Payload:', JSON.stringify(payload, null, 2));

      this.routesService.createRouteWithStops(payload).subscribe({
        next: () => this.router.navigate(['/admin/routes']),
        error: (err) => console.error('Error creating route:', err),
      });
    }
  }

  // Helper method
  createRouteWithStopsPayload(routeData: {
    startDate: string;
    endDate: string;
    dailyValidity: DailyValidity;
    stops: RouteConnectStop[];
  }): RouteConnectStopForCreation {
    return {
      route: {
        validFrom: routeData.startDate,
        validUntil: routeData.endDate,
        dailyValidity: DailyValidity[routeData.dailyValidity as keyof typeof DailyValidity],
      },
      stops: routeData.stops.map((stop) => ({
        shortName: stop.shortName,
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude,
        departureTime: stop.departureTime,
      })),
    };
  }

  cancel(): void {
    this.router.navigate(['/admin/routes']);
  }

  updateErrorMessages() {
    this.errors = {};

    for (const message of RouteFormErrorMessages) {
      const control = this.routeForm.get(message.forControl);
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

    // Custom validation for start-/enddate
    const startDate = this.routeForm.get('startDate')?.value;
    const endDate = this.routeForm.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      this.errors['endDate'] = 'Enddatum muss nach dem Startdatum liegen.';
    }
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }
}