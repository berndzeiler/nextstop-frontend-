import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DelayStatisticsService } from '../services/delay-statistics.service';
import { DelayStatistics } from '../models/delay-statistics.model';
import { DelayStatisticsFormErrorMessages } from '../helpers/error-message';
import { RoutesService } from '../services/routes.service';
import { Route } from '../models/route.model';
import { CommonModule } from '@angular/common';
import { dateRangeValidator } from '../helpers/validators/date-range-validator.directive';

@Component({
  selector: 'wea5-delay-statistics',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './delay-statistics.component.html',
  styles: ``
})
export class DelayStatisticsComponent implements OnInit {
  statisticsForm!: FormGroup;
  statistics: DelayStatistics[] = [];
  routes: Route[] = [];
  errors: { [key: string]: string } = {};
  noRoutesFoundMessage: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private statisticsService: DelayStatisticsService,
    private routesService: RoutesService
  ) {}

  ngOnInit(): void {
    this.statisticsForm = this.fb.group(
      {
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      routeNumber: [''], // Optional route selection
      },
      { validators: dateRangeValidator() }
    );

    this.routesService.getRoutes().subscribe({
      next: (routes) => {
        this.routes = routes || [];
      },
      error: () => {
        this.errorMessage = 'Fehler beim Laden der verfügbaren Routen.';
      },
    });

    this.statisticsForm.statusChanges.subscribe(() => this.updateErrorMessages());
  }

  searchStatistics(): void {
    if (this.statisticsForm.invalid) {
      this.updateErrorMessages();
      return;
    }

    const { startDate, endDate, routeNumber } = this.statisticsForm.value;

    this.isLoading = true;
    this.errorMessage = null;
    this.noRoutesFoundMessage = null;
    this.statistics = [];

    this.statisticsService.getDelayStatistics(startDate, endDate, routeNumber).subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.noRoutesFoundMessage = 'Diese Route/n wird/werden in diesem Zeitraum nicht angefahren.';
        } else {
          this.errorMessage = 'Fehler beim Laden der Verspätungsstatistik.';
        }
        this.isLoading = false;
      }
    });
  }

  updateErrorMessages(): void {
    this.errors = {};
    for (const message of DelayStatisticsFormErrorMessages) {
      const control = this.statisticsForm.get(message.forControl);
      if (
        control &&
        control.dirty &&
        control.invalid &&
        control.errors?.[message.forValidator]
      ) {
        this.errors[message.forControl] = message.text;
      }
    }

    // Custom validation for start-/enddate
    const startDate = this.statisticsForm.get('startDate')?.value;
    const endDate = this.statisticsForm.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      this.errors['endDate'] = 'Enddatum muss nach dem Startdatum liegen.';
    }
  }
}
