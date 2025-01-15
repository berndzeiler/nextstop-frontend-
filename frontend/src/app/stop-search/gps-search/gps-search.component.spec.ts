import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsSearchComponent } from './gps-search.component';

describe('GpsSearchComponent', () => {
  let component: GpsSearchComponent;
  let fixture: ComponentFixture<GpsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpsSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
