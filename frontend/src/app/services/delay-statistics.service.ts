import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DelayStatistics } from '../models/delay-statistics.model';

@Injectable({
  providedIn: 'root',
})
export class DelayStatisticsService {
  constructor(private http: HttpClient) {}

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

    return this.http.get<DelayStatistics[]>(`${environment.server}/delaystatistics/delay-statistics`, { params });
  }
}
