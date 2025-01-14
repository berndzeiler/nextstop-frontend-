import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../services/routes.service';
import { Route, DailyValidityTranslations } from '../../models/route.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { RouteStopsDetails } from '../../models/route-connect-stop.model';

@Component({
  selector: 'wea5-routes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './routes.component.html',
  styles: ``
})
export class RoutesComponent implements OnInit {
  routes: (Route & RouteStopsDetails)[] = [];

  constructor(private routesService: RoutesService, private router: Router) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.routesService.getRoutes().subscribe((routes) => {
      const routeRequests = routes.map((route) =>
        this.routesService.getRouteStopsDetails(route.routeNumber).pipe(
          map((details) => ({
            ...route,
            startStop: details?.startStop || null,
            endStop: details?.endStop || null,
            stops: details?.stops || [],
          }))
        )
      );
  
      forkJoin(routeRequests).subscribe({
        next: (routesWithDetails) => (this.routes = routesWithDetails),
        error: (err) => console.error('Error loading routes with details:', err),
      });
    });
  }

  createRoute(): void {
    this.router.navigate(['/admin/routes/add']);
  }

  getDailyValidityTranslation(value: string): string {
    return DailyValidityTranslations[value as keyof typeof DailyValidityTranslations] || value;
  }
}
