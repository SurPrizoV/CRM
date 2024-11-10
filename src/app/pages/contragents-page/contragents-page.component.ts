import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Company } from '../../shared/interfaces';
import { CompaniesService } from '../../shared/services/companies.service';
import { SearchService } from '../../shared/services/search.service';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { SquareComponent } from '../../shared/SVG/square/square.component';
import { CompanyComponent } from '../../shared/SVG/company/company.component';

@Component({
  selector: 'app-contragents-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FilterPipe,
    SquareComponent,
    CompanyComponent,
  ],
  templateUrl: './contragents-page.component.html',
})
export class ContragentsPageComponent implements OnInit {
  searchText: string = '';
  companies$!: Observable<Company[]>;
  statusMap: { [key: string]: string } = {
    partner: 'Партнер',
    client: 'Клиент',
    stopped: 'Прекратили сотрудничество',
    negotiation: 'Переговоры',
  };

  constructor(
    private router: Router,
    private companiesService: CompaniesService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.companiesService.fetchCompanies();
    this.companies$ = this.companiesService.companies$.pipe(
      catchError(() => of([]))
    );

    this.searchService.search$.subscribe((text) => {
      this.searchText = text;
    });
  }

  onNavigate(companyId: string) {
    this.router.navigate([`/contragents/contragent/${companyId}`]);
  }
}
