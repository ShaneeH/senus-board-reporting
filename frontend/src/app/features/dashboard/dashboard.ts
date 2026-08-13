import { Component, OnInit, inject } from '@angular/core';

import { CompanyService } from '../../core/services/company.service';

import {
    DropdownOption,
    DropdownSelectComponent
} from '../../shared/components/dropdown-selector/dropdown-selector';

import {
    KpiCardComponent
} from '../../shared/components/kpi-card/kpi-card';

import {
    FinancialPeriod
} from '../../core/models/financial-period.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        DropdownSelectComponent,
        KpiCardComponent
    ],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

    private companyService = inject(CompanyService);

    companies: DropdownOption<number>[] = [];

    periods: DropdownOption<string>[] = [];

    comparePeriods: DropdownOption<string>[] = [];

    selectedCompany:
        DropdownOption<number> | null = null;

    selectedPeriod:
        DropdownOption<string> | null = null;

    selectedComparePeriod:
        DropdownOption<string> | null = null;

    financialPeriod:
        FinancialPeriod | null = null;


    ngOnInit(): void {

        this.loadCompanies();

    }


    private loadCompanies(): void {

        this.companyService
            .getCompanies()
            .subscribe({

                next: companies => {

                    this.companies =
                        companies.map(company => ({

                            label: company.companyName,

                            value: company.companyId

                        }));

                },

                error: error => {

                    console.error(
                        'Failed to load companies.',
                        error
                    );

                }

            });

    }


    onCompanySelected(
        company: DropdownOption<number>
    ): void {

        this.selectedCompany = company;

        /*
         * Reset data belonging to the
         * previously selected company.
         */
        this.selectedPeriod = null;

        this.selectedComparePeriod = null;

        this.financialPeriod = null;

        this.periods = [];

        this.comparePeriods = [];

        this.loadPeriods(company.value);

    }


    private loadPeriods(
        companyId: number
    ): void {

        this.companyService
            .getPeriods(companyId)
            .subscribe({

                next: periods => {

                    this.periods =
                        periods.map(period => ({

                            label: period.periodLabel,

                            value: period.period

                        }));

                },

                error: error => {

                    console.error(
                        'Failed to load company periods.',
                        error
                    );

                }

            });

    }


    onPeriodSelected(
        period: DropdownOption<string>
    ): void {

        this.selectedPeriod = period;

        /*
         * Changing the main period invalidates
         * the previous comparison.
         */
        this.selectedComparePeriod = null;

        /*
         * Don't allow a period to be
         * compared with itself.
         */
        this.comparePeriods =
            this.periods.filter(
                option =>
                    option.value !== period.value
            );

        if (!this.selectedCompany) {
            return;
        }

        this.companyService
            .getFinancialPeriod(
                this.selectedCompany.value,
                period.value
            )
            .subscribe({

                next: financialPeriod => {

                    this.financialPeriod =
                        financialPeriod;

                    console.log(
                        'Financial period:',
                        financialPeriod
                    );

                },

                error: error => {

                    console.error(
                        'Failed to load financial period.',
                        error
                    );

                }

            });

    }


    onComparePeriodSelected(
        comparePeriod: DropdownOption<string>
    ): void {

        this.selectedComparePeriod =
            comparePeriod;

        if (
            !this.selectedCompany ||
            !this.selectedPeriod
        ) {
            return;
        }

        this.companyService
            .getFinancialPeriod(

                this.selectedCompany.value,

                this.selectedPeriod.value,

                comparePeriod.value

            )
            .subscribe({

                next: financialPeriod => {

                    this.financialPeriod =
                        financialPeriod;

                    console.log(
                        'Financial comparison:',
                        financialPeriod.comparison
                    );

                },

                error: error => {

                    console.error(
                        'Failed to compare financial periods.',
                        error
                    );

                }

            });

    }

}