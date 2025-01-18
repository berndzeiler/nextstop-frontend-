import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Stop } from '../models/stop.model';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './helper/auth.service';
import { ErrorHandlerService } from './helper/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class StopsService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) { }

  getStops(): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${environment.server}/stops`)
      .pipe(catchError((error) => this.errorHandler.handle<Stop[]>(error)));
  }

  getStopByShortName(shortName: string): Observable<Stop> {
    return this.http.get<Stop>(`${environment.server}/stops/${shortName}`)
      .pipe(catchError((error) => this.errorHandler.handle<Stop>(error)));
  }


  searchStops(searchTerm?: string): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${environment.server}/stops/search?searchTerm=${searchTerm}`)
      .pipe(catchError((error) => this.errorHandler.handle<Stop[]>(error)));
  }

  findNearbyStops(
    latitude: number,
    longitude: number,
    maxDistanceInKm: number = 10,
    maxResults: number = 10
  ): Observable<Stop[]> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('maxDistanceInKm', maxDistanceInKm.toString())
      .set('maxResults', maxResults.toString());

    return this.http.get<Stop[]>(`${environment.server}/stops/nearby`, { params })
      .pipe(catchError((error) => this.errorHandler.handle<Stop[]>(error)));
  }

  isShortNameUnique(shortName: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.server}/stops/check-unique?shortName=${shortName}`)
      .pipe(catchError((error) => this.errorHandler.handle<boolean>(error)));
  }

  createStop(stop: Stop): Observable<Stop> {
    return this.http.post<Stop>(`${environment.server}/stops`, stop, {
      headers: this.authService.getAuthHeaders(),
    }).pipe(catchError((error) => this.errorHandler.handle<Stop>(error)));
  }

  updateStop(shortName: string, stop: Stop): Observable<void> {
    return this.http.put<void>(`${environment.server}/stops/${shortName}`, stop, {
      headers: this.authService.getAuthHeaders(),
    }).pipe(catchError((error) => this.errorHandler.handle<void>(error)));
  }

  deleteStop(shortName: string): Observable<void> {
    return this.http.delete<void>(`${environment.server}/stops/${shortName}`, {
      headers: this.authService.getAuthHeaders(),
    }).pipe(catchError((error) => this.errorHandler.handle<void>(error)));
  }
}
