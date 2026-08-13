import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerChart } from './customer-chart';

describe('CustomerChart', () => {
  let component: CustomerChart;
  let fixture: ComponentFixture<CustomerChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerChart],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
