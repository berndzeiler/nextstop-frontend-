import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable } from 'rxjs';
import { DelayStatistics } from '../models/delay-statistics.model';
import { ErrorHandlerService } from './helper/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class DelayStatisticsService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getDelayStatistics(
    startDate: string,
    endDate: string,
    routeNumber?: number
  ): Observable<DelayStatistics[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    if (routeNumber) {
      params = params.set('routeNumber', routeNumber);
    }

    return this.http.get<DelayStatistics[]>(`${environment.server}/delaystatistics/delay-statistics`, { params })
      .pipe(catchError((error) => this.errorHandler.handle<DelayStatistics[]>(error)));;
  }
}
