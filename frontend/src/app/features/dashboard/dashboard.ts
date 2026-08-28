import { Component, OnInit, inject } from '@angular/core';

import { CompanyService } from '../../core/services/company.service';
import { FinancialPeriod } from '../../core/models/financial-period.model';
import { HistoryPeriod } from '../../core/models/history-period.model';

import { CustomerChartComponent } from '../../shared/components/customer-chart/customer-chart';
import { DropdownOption, DropdownSelectComponent } from '../../shared/components/dropdown-selector/dropdown-selector';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card';
import { RevenueChartComponent } from '../../shared/components/revenue-chart/revenue-chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DropdownSelectComponent, KpiCardComponent, RevenueChartComponent, CustomerChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private companyService = inject(CompanyService);

  // Dropdown data loaded from the backend.
  companies: DropdownOption<number>[] = [];
  periods: DropdownOption<string>[] = [];
  comparePeriods: DropdownOption<string>[] = [];

  // Full history is used by the dashboard charts.
  history: HistoryPeriod[] = [];

  // Current dashboard selections.
  selectedCompany: DropdownOption<number> | null = null;
  selectedPeriod: DropdownOption<string> | null = null;
  selectedComparePeriod: DropdownOption<string> | null = null;

  financialPeriod: FinancialPeriod | null = null;
  companyName = '';

  emptyData: boolean = true;

  ngOnInit(): void {
    // Load available companies when the dashboard first opens.
    this.loadCompanies();
   
  }

  onCompanySelected(company: DropdownOption<number>): void {
    this.selectedCompany = company;
    this.companyName = company.label;

    // Clear old dashboard data before loading the new company.
    this.selectedPeriod = null;
    this.selectedComparePeriod = null;
    this.financialPeriod = null;
    this.periods = [];
    this.comparePeriods = [];
    this.history = [];

    this.loadPeriods(company.value);
    this.loadHistory(company.value);
  }

  onPeriodSelected(period: DropdownOption<string>): void {
    this.selectedPeriod = period;
    this.selectedComparePeriod = null;

    // Don't allow a period to compare against itself.
    this.comparePeriods = this.periods.filter(option => option.value !== period.value);

    if (!this.selectedCompany) return;

    // Load the main financial data for the selected period.
    this.companyService
      .getFinancialPeriod(this.selectedCompany.value, period.value)
      .subscribe({
        next: financialPeriod => {
          this.financialPeriod = financialPeriod;
        },
        error: error => console.error('Failed to load financial period.', error)
      });
  }

  onComparePeriodSelected(comparePeriod: DropdownOption<string>): void {
    this.selectedComparePeriod = comparePeriod;

    if (!this.selectedCompany || !this.selectedPeriod) return;

    // Reload the period with comparison data included.
    this.companyService
      .getFinancialPeriod(this.selectedCompany.value, this.selectedPeriod.value, comparePeriod.value)
      .subscribe({
        next: financialPeriod => {
          this.financialPeriod = financialPeriod;
        },
        error: error => console.error('Failed to compare financial periods.', error)
      });
  }
private loadCompanies(): void {
  this.companyService.getCompanies().subscribe({
    next: companies => {
      this.companies = companies.map(company => ({
        label: company.companyName,
        value: company.companyId
      }));

      this.emptyData = companies.length === 0;
    },
    error: error => console.error('Failed to load companies.', error)
  });
}

  private loadPeriods(companyId: number): void {
    this.companyService.getPeriods(companyId).subscribe({
      next: periods => {
        // Convert the company's periods into dropdown options.
        this.periods = periods.map(period => ({
          label: period.periodLabel,
          value: period.period
        }));
      },
      error: error => console.error('Failed to load company periods.', error)
    });
  }

  private loadHistory(companyId: number): void {
    this.companyService.getHistory(companyId).subscribe({
      next: history => {
        // Store all periods so the charts can show trends over time.
        this.history = history;
      },
      error: error => console.error('Failed to load company history.', error)
    });
  }
}