import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable } from 'rxjs';
import { Schedule } from '../models/schedule';
import { ErrorHandlerService } from './helper/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class TripPlannerService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getSchedules(
    startStop: string,
    endStop: string,
    dateTime: string,
    connections: number,
    isArrival: boolean
  ): Observable<Schedule[]> {
    const params = new HttpParams()
      .set('startStop', startStop)
      .set('endStop', endStop)
      .set('dateTime', dateTime)
      .set('connections', connections)
      .set('isArrival', isArrival.toString());

    return this.http.get<Schedule[]>(`${environment.server}/schedule/connections`, { params })
      .pipe(catchError((error) => this.errorHandler.handle<Schedule[]>(error)));
  }
}