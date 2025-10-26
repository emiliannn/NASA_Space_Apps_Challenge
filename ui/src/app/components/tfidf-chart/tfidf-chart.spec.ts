import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfidfChart } from './tfidf-chart';

describe('TfidfChart', () => {
  let component: TfidfChart;
  let fixture: ComponentFixture<TfidfChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TfidfChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TfidfChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
