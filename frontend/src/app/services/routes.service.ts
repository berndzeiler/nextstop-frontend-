import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Route } from '../models/route.model';
import { RouteConnectStopForCreation, RouteStopsDetails } from '../models/route-connect-stop.model';
import { catchError, Observable } from 'rxjs';
import { AuthService } from './helper/auth.service';
import { ErrorHandlerService } from './helper/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) { }

  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(`${environment.server}/routes`)
      .pipe(catchError((error) => this.errorHandler.handle<Route[]>(error)));
  }

  getRouteByNumber(routeNumber: number): Observable<Route> {
    return this.http.get<Route>(`${environment.server}/routes/${routeNumber}`)
      .pipe(catchError((error) => this.errorHandler.handle<Route>(error)));
  }

  getRouteStopsDetails(routeNumber: number): Observable<RouteStopsDetails> {
    return this.http.get<RouteStopsDetails>(
      `${environment.server}/routeconnectstops/${routeNumber}/details`
    ).pipe(catchError((error) => this.errorHandler.handle<RouteStopsDetails>(error)));
  }

  createRouteWithStops(payload: RouteConnectStopForCreation): Observable<any> {
    return this.http
      .post<any>(`${environment.server}/routeconnectstops`, payload, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(catchError((error) => this.errorHandler.handle<any>(error)));
  }
}