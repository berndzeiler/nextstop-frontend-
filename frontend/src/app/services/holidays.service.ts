import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Holiday } from '../models/holiday.model';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthService } from './helper/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  getHolidays(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${environment.server}/holidays`, {
      headers: this.authService.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  getHolidayById(holidayId: number): Observable<Holiday> {
    return this.http.get<Holiday>(`${environment.server}/holidays/${holidayId}`, {
      headers: this.authService.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error in getHolidayById:', error);
        return throwError(() => error);
      })
    );
  }

  createHoliday(holiday: Omit<Holiday, 'holidayId'>): Observable<Holiday> {
    return this.http.post<Holiday>(`${environment.server}/holidays`, holiday, {
      headers: this.authService.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  updateHoliday(holiday: Holiday): Observable<void> {
    return this.http.put<void>(`${environment.server}/holidays/${holiday.holidayId}`, holiday, {
      headers: this.authService.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  deleteHoliday(holidayId: number): Observable<void> {
    return this.http.delete<void>(`${environment.server}/holidays/${holidayId}`, {
      headers: this.authService.getAuthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }
}
