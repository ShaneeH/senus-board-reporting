import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { FinancialDocument } from '../../../core/models/document.model';
import { CompanyService } from '../../../core/services/company.service';
import { ViewDocuments } from './view-documents';

describe('ViewDocuments', () => {
  let component: ViewDocuments;
  let fixture: ComponentFixture<ViewDocuments>;

  const document: FinancialDocument = {
    documentId: 12,
    companyId: 1,
    companyName: 'Senus PLC',
    reportName: 'Annual Report 2025',
    reportType: 'Annual Report',
    reportDate: '2025-12-31',
    currency: 'EUR',
    source: 'https://example.com/report.pdf',
    uploadedAt: '2026-09-04T20:00:00.000Z',
    periods: [
      {
        periodId: 7,
        period: 'FY2025',
        periodLabel: 'Full Year 2025',
        periodEnd: '2025-12-31'
      }
    ]
  };

  const companyService = {
    getDocuments: vi.fn(),
    deleteDocument: vi.fn(),
    getReportExportUrl: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    companyService.getDocuments.mockReturnValue(of([document]));
    companyService.getReportExportUrl.mockImplementation(
      (documentId: number, format: string) =>
        `http://localhost:3000/api/reports/${documentId}/export.${format}`
    );

    await TestBed.configureTestingModule({
      imports: [ViewDocuments],
      providers: [
        { provide: CompanyService, useValue: companyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDocuments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders JSON, PDF and CSV export links for each report', () => {
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('.export-link')
    ) as HTMLAnchorElement[];

    expect(links.map(link => link.textContent?.trim())).toEqual([
      'JSON',
      'PDF',
      'CSV'
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and display the uploaded documents', () => {
    expect(companyService.getDocuments).toHaveBeenCalledTimes(1);
    expect(component.documents).toEqual([document]);
    expect(fixture.nativeElement.textContent).toContain('Annual Report 2025');
    expect(fixture.nativeElement.textContent).toContain('Senus PLC');
    expect(fixture.nativeElement.textContent).toContain('FY2025');
  });

  it('should delete a confirmed document', () => {
    companyService.deleteDocument.mockReturnValue(of({
      success: true,
      message: 'Document deleted successfully.'
    }));

    component.requestDelete(document.documentId);
    component.confirmDelete(document);

    expect(companyService.deleteDocument).toHaveBeenCalledWith(12);
    expect(component.documents).toEqual([]);
    expect(component.successMessage).toBe('Document deleted successfully.');
  });

  it('should show the backend message when loading fails', () => {
    const error = new HttpErrorResponse({
      status: 500,
      error: { error: 'Failed to retrieve documents.' }
    });

    companyService.getDocuments.mockReturnValue(throwError(() => error));
    component.loadDocuments();

    expect(component.errorMessage).toBe('Failed to retrieve documents.');
    expect(component.isLoading).toBe(false);
  });
});
