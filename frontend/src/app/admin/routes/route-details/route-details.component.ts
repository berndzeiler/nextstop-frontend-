import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutesService } from '../../../services/routes.service';
import { Route, DailyValidityTranslations } from '../../../models/route';
import { RouteStopsDetails } from '../../../models/routeconnectstop';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'wea5-route-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './route-details.component.html',
  styles: []
})
export class RouteDetailsComponent implements OnInit {
  routeNumber: number | null = null;
  route: Route | null = null;
  routeStopsDetails: RouteStopsDetails | null = null;

  constructor(
    private routesService: RoutesService,
    private routeParam: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const routeNumber = this.routeParam.snapshot.paramMap.get('routeNumber');
    if (routeNumber) {
      this.routeNumber = +routeNumber;
      this.loadRouteDetails();
    }
  }

  loadRouteDetails(): void {
    if (this.routeNumber) {
      forkJoin({
        routeInfo: this.routesService.getRouteByNumber(this.routeNumber),
        routeStops: this.routesService.getRouteStopsDetails(this.routeNumber),
      }).subscribe({
        next: ({ routeInfo, routeStops }) => {
          this.route = {
            routeNumber: this.routeNumber!,
            validFrom: routeInfo.validFrom,
            validUntil: routeInfo.validUntil,
            dailyValidity: routeInfo.dailyValidity,
          };
          this.routeStopsDetails = routeStops;
        },
        error: (err) => console.error('Error loading route details:', err),
      });
    }
  }

  getDailyValidityTranslation(value: string): string {
    return DailyValidityTranslations[value as keyof typeof DailyValidityTranslations] || value;
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }
}
