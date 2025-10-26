import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionChart } from './prediction-chart';

describe('PredictionChart', () => {
  let component: PredictionChart;
  let fixture: ComponentFixture<PredictionChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredictionChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictionChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
