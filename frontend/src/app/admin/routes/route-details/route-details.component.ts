import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoutesService } from '../../../services/routes.service';
import { Route, DailyValidityTranslations } from '../../../models/route.model';
import { RouteStopsDetails } from '../../../models/route-connect-stop.model';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { StopsService } from '../../../services/stops.service';

@Component({
  selector: 'wea5-route-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './route-details.component.html',
  styles: ``
})
export class RouteDetailsComponent implements OnInit {
  routeNumber: number | null = null;
  route: Route | null = null;
  routeStopsDetails: RouteStopsDetails | null = null;

  constructor(
    private routesService: RoutesService,
    private stopsService: StopsService,
    private routeParam: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const routeNumber = this.routeParam.snapshot.paramMap.get('routeNumber');
    if (routeNumber) {
      this.routeNumber = +routeNumber;
      this.loadRouteDetails();
    }
  }

  loadRouteDetails(): void {
    if (this.routeNumber) {
      this.routesService.getRouteByNumber(this.routeNumber).subscribe({
        next: (routeInfo) => {
          if (!routeInfo) {
            this.router.navigate(['/admin/routes']); // Redirect to the routes list on error
            return;
          }
  
          this.route = {
            routeNumber: this.routeNumber!,
            validFrom: routeInfo.validFrom,
            validUntil: routeInfo.validUntil,
            dailyValidity: routeInfo.dailyValidity,
          };
  
          this.routesService.getRouteStopsDetails(this.routeNumber!).subscribe({
            next: (routeStops) => {
              forkJoin(
                routeStops.stops.map((stop) =>
                  this.stopsService.getStopByShortName(stop.shortName).pipe(
                    map((fullStop) => ({
                      ...stop,
                      name: fullStop.name,
                      longitude: fullStop.longitude,
                      latitude: fullStop.latitude,
                    }))
                  )
                )
              ).subscribe((enrichedStops) => {
                this.routeStopsDetails = {
                  ...routeStops,
                  stops: enrichedStops,
                };
              });
            },
            error: () => {
              console.error('Error loading route stops.');
            },
          });
        },
        error: () => {
          this.router.navigate(['/admin/routes']);
        },
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
