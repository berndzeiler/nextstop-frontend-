import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Route } from '../models/route.model';
import { RouteConnectStopForCreation, RouteStopsDetails } from '../models/route-connect-stop.model';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from './helper/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.error(error);
    return of(null);
  }

  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(`${environment.server}/routes`)
    .pipe(catchError(this.errorHandler));
  }

  getRouteByNumber(routeNumber: number): Observable<Route> {
    return this.http.get<Route>(`${environment.server}/routes/${routeNumber}`)
    .pipe(catchError(this.errorHandler));
  }

  getRouteStopsDetails(routeNumber: number): Observable<RouteStopsDetails> {
    return this.http.get<RouteStopsDetails>(
      `${environment.server}/routeconnectstops/${routeNumber}/details`
    ).pipe(catchError(this.errorHandler));
  }

  createRouteWithStops(payload: RouteConnectStopForCreation): Observable<any> {
    return this.http
      .post<any>(`${environment.server}/routeconnectstops`, payload, {
        headers: this.authService.getAuthHeaders(),
      }).pipe(catchError(this.errorHandler));
  }
}