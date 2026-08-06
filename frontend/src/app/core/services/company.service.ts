import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Company } from '../models/company.model';
import { CompanyPeriod } from '../models/company-period.model';
import { FinancialPeriod } from '../models/financial-period.model';
import { HistoryPeriod } from '../models/history-period.model';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    private http = inject(HttpClient);

    getCompanies(): Observable<Company[]> {

        return this.http.get<Company[]>(
            `${environment.apiUrl}/companies`
        );

    }

    getPeriods(
        companyId: number
    ): Observable<CompanyPeriod[]> {

        return this.http.get<CompanyPeriod[]>(
            `${environment.apiUrl}/companies/${companyId}/periods`
        );

    }

    getFinancialPeriod(
        companyId: number,
        period: string,
        compareTo?: string
    ): Observable<FinancialPeriod> {

        let params = new HttpParams();

        if (compareTo) {
            params = params.set(
                'compareTo',
                compareTo
            );
        }

        return this.http.get<FinancialPeriod>(
            `${environment.apiUrl}/companies/${companyId}/periods/${period}`,
            {
                params
            }
        );

    }

    getHistory(
        companyId: number
    ): Observable<HistoryPeriod[]> {

        return this.http.get<HistoryPeriod[]>(
            `${environment.apiUrl}/companies/${companyId}/history`
        );

    }

}