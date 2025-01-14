import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedStopDisplayComponent } from './selected-stop-display.component';

describe('SelectedStopDisplayComponent', () => {
  let component: SelectedStopDisplayComponent;
  let fixture: ComponentFixture<SelectedStopDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedStopDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedStopDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
