import { Component, inject } from '@angular/core';
import { CompanyService } from '../../core/services/company.service';



@Component({
  selector: 'app-dashboard',
  imports: [

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private companyService = inject(CompanyService);

  x: number = 10;

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
       console.log(companies);
       },
      error: (e) => {
        console.error(e);
      }
    });

  }
}