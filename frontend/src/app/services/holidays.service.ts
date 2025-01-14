import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Holiday } from '../models/holiday.model';
import { catchError, Observable, of } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  constructor(private http: HttpClient, private oauthService: OAuthService) {}

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.oauthService.getAccessToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getHolidays(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${environment.server}/holidays`, {
      headers: this.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  getHolidayById(holidayId: number): Observable<Holiday> {
    return this.http.get<Holiday>(`${environment.server}/holidays/${holidayId}`, {
      headers: this.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  createHoliday(holiday: Omit<Holiday, 'holidayId'>): Observable<Holiday> {
    return this.http.post<Holiday>(`${environment.server}/holidays`, holiday, {
      headers: this.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  updateHoliday(holiday: Holiday): Observable<void> {
    return this.http.put<void>(`${environment.server}/holidays/${holiday.holidayId}`, holiday, {
      headers: this.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  deleteHoliday(holidayId: number): Observable<void> {
    return this.http.delete<void>(`${environment.server}/holidays/${holidayId}`, {
      headers: this.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }
}
