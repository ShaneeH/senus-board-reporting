import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitabilityChart } from './profitability-chart';

describe('ProfitabilityChart', () => {
  let component: ProfitabilityChart;
  let fixture: ComponentFixture<ProfitabilityChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitabilityChart],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfitabilityChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
