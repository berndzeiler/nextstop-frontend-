import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Stop } from '../models/stop.model';
import { catchError, Observable, of } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class StopsService {
  constructor(private http: HttpClient, private oauthService: OAuthService) {}

  private errorHandler(error: Error | any): Observable<any> {
    console.error(error);
    return of(null);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.oauthService.getAccessToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getStops(): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${environment.server}/stops`)
      .pipe(catchError(this.errorHandler));
  }

  getStopByShortName(shortName: string): Observable<Stop> {
    return this.http.get<Stop>(`${environment.server}/stops/${shortName}`)
      .pipe(catchError(this.errorHandler));
  }

   searchStops(searchTerm?: string): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${environment.server}/stops/search?searchTerm=${searchTerm}`)
      .pipe(catchError(this.errorHandler));
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
      .pipe(catchError(this.errorHandler));
  }

  isShortNameUnique(shortName: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.server}/stops/check-unique?shortName=${shortName}`)
      .pipe(catchError(this.errorHandler));
  }

  createStop(stop: Stop): Observable<Stop> {
    return this.http.post<Stop>(`${environment.server}/stops`, stop, {
      headers: this.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  updateStop(shortName: string, stop: Stop): Observable<void> {
    return this.http.put<void>(`${environment.server}/stops/${shortName}`, stop, {
      headers: this.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  deleteStop(shortName: string): Observable<void> {
    return this.http.delete<void>(`${environment.server}/stops/${shortName}`, {
      headers: this.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }
}
