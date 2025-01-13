import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayStatisticsComponent } from './delay-statistics.component';

describe('DelayStatisticsComponent', () => {
  let component: DelayStatisticsComponent;
  let fixture: ComponentFixture<DelayStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelayStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelayStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
