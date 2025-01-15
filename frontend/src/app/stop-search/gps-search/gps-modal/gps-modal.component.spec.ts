import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsModalComponent } from './gps-modal.component';

describe('GpsModalComponent', () => {
  let component: GpsModalComponent;
  let fixture: ComponentFixture<GpsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
