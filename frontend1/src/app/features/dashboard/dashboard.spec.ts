import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Dashboard } from './dashboard';
import { CompanyService } from '../../core/services/company.service';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const companyService = {
    getCompanies: vi.fn(),
    getPeriods: vi.fn(),
    getFinancialPeriod: vi.fn(),
    getHistory: vi.fn(),
    getDocuments: vi.fn(),
    getReportExportUrl: vi.fn()
  };

  beforeEach(async () => {
    // Reset mocks before every test.
    vi.clearAllMocks();

    companyService.getCompanies.mockReturnValue(of([]));
    companyService.getPeriods.mockReturnValue(of([]));
    companyService.getHistory.mockReturnValue(of([]));
    companyService.getDocuments.mockReturnValue(of([]));
    companyService.getReportExportUrl.mockImplementation(
      (documentId: number, format: string) =>
        `http://localhost:3000/api/reports/${documentId}/export.${format}`
    );

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: CompanyService, useValue: companyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load companies when the dashboard starts', () => {
    expect(companyService.getCompanies).toHaveBeenCalled();
  });

  it('should convert companies into dropdown options', () => {
    companyService.getCompanies.mockReturnValue(of([
      {
        companyId: 1,
        companyName: 'Senus PLC'
      }
    ]));

    component.ngOnInit();

    expect(component.companies).toEqual([
      {
        label: 'Senus PLC',
        value: 1
      }
    ]);
  });

  it('should load periods and history when a company is selected', () => {
    component.onCompanySelected({
      label: 'Senus PLC',
      value: 1
    });

    expect(companyService.getPeriods).toHaveBeenCalledWith(1);
    expect(companyService.getHistory).toHaveBeenCalledWith(1);
    expect(companyService.getDocuments).toHaveBeenCalledWith(1);
  });

  it('matches selected periods to their source reports for export', () => {
    component.selectedPeriod = { label: 'FY2025', value: 'FY2025' };
    component.reportDocuments = [{
      documentId: 12,
      companyId: 1,
      companyName: 'Senus PLC',
      reportName: 'Annual Report 2025',
      reportType: 'Annual Report',
      reportDate: '2025-12-31',
      currency: 'EUR',
      source: null,
      uploadedAt: '2026-09-04T20:00:00.000Z',
      periods: [{
        periodId: 7,
        period: 'FY2025',
        periodLabel: 'Full Year 2025',
        periodEnd: '2025-12-31'
      }]
    }];

    expect(component.selectedReportDocuments).toHaveLength(1);
    expect(component.selectedReportDocuments[0].documentId).toBe(12);

    component.emptyData = false;
    component.financialPeriod = {
      financials: {
        companyName: 'Senus PLC',
        periodLabel: 'Full Year 2025'
      }
    } as any;
    fixture.detectChanges();

    const exportLinks = fixture.nativeElement.querySelectorAll(
      '.dashboard-export-links a'
    );
    expect(exportLinks).toHaveLength(3);
    expect(exportLinks[0].textContent.trim()).toBe('JSON');
    expect(exportLinks[1].textContent.trim()).toBe('PDF');
    expect(exportLinks[2].textContent.trim()).toBe('CSV');
  });

  it('should clear old data when a new company is selected', () => {
    component.selectedPeriod = {
      label: 'FY2025',
      value: 'FY2025'
    };

    component.selectedComparePeriod = {
      label: 'FY2024',
      value: 'FY2024'
    };

    component.onCompanySelected({
      label: 'Senus PLC',
      value: 1
    });

    expect(component.selectedPeriod).toBeNull();
    expect(component.selectedComparePeriod).toBeNull();
    expect(component.financialPeriod).toBeNull();
  });

  it('should remove the selected period from comparison options', () => {
    component.periods = [
      { label: 'FY2023', value: 'FY2023' },
      { label: 'FY2024', value: 'FY2024' },
      { label: 'FY2025', value: 'FY2025' }
    ];

    component.onPeriodSelected({
      label: 'FY2025',
      value: 'FY2025'
    });

    expect(component.comparePeriods).toEqual([
      { label: 'FY2023', value: 'FY2023' },
      { label: 'FY2024', value: 'FY2024' }
    ]);
  });

  it('should load financial data for the selected period', () => {
    const financialPeriod = {
      financials: {},
      comparison: null
    } as any;

    component.selectedCompany = {
      label: 'Senus PLC',
      value: 1
    };

    companyService.getFinancialPeriod.mockReturnValue(of(financialPeriod));

    component.onPeriodSelected({
      label: 'FY2025',
      value: 'FY2025'
    });

    expect(companyService.getFinancialPeriod)
      .toHaveBeenCalledWith(1, 'FY2025');

    expect(component.financialPeriod).toBe(financialPeriod);
  });

  it('should load comparison data', () => {
    const financialPeriod = {
      financials: {},
      comparison: {}
    } as any;

    component.selectedCompany = {
      label: 'Senus PLC',
      value: 1
    };

    component.selectedPeriod = {
      label: 'FY2025',
      value: 'FY2025'
    };

    companyService.getFinancialPeriod.mockReturnValue(of(financialPeriod));

    component.onComparePeriodSelected({
      label: 'FY2024',
      value: 'FY2024'
    });

    expect(companyService.getFinancialPeriod)
      .toHaveBeenCalledWith(1, 'FY2025', 'FY2024');
  });
});
