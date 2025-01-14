import { TestBed } from '@angular/core/testing';

import { DelayStatisticsService } from './delay-statistics.service';

describe('DelayStatisticsService', () => {
  let service: DelayStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelayStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
