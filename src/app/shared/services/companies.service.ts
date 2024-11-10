import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Company } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { companies } from '../links';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  companiesSubject = new BehaviorSubject<Company[]>([]);
  companies$ = this.companiesSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchCompanies() {
    this.http
      .get<{ [key: string]: Company }>(`${environment.fbDbUrl}/companies.json`)
      .pipe(
        map((responseData) => {
          const companiesArray: Company[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              companiesArray.push({ ...responseData[key], id: key });
            }
          }
          return companiesArray;
        })
      )
      .subscribe((companies) => {
        this.companiesSubject.next(companies);
      });
  }

  addCompany(company: Company) {
    const companyWithImage = { 
      ...company, 
      img: companies[Object.keys(companies)[Math.floor(Math.random() * 3)]]
    };
    this.http
      .post<{ name: string }>(`${environment.fbDbUrl}/companies.json`, companyWithImage)
      .subscribe({
        next: (response) => {
          const newCompany = { ...companyWithImage, id: response.name };
          this.companiesSubject.next([
            ...this.companiesSubject.value,
            newCompany,
          ]);
        },
      });
  }

  updateCompany(updatedCompany: Company) {
    this.http
      .put(
        `${environment.fbDbUrl}/companies/${updatedCompany.id}.json`,
        updatedCompany
      )
      .subscribe({
        next: () => {
          const companies = this.companiesSubject.value.map((company) =>
            company.id === updatedCompany.id ? updatedCompany : company
          );
          this.companiesSubject.next(companies);
        },
      });
  }

  getCompanyById(id: string): Observable<Company | undefined> {
    return this.http
      .get<Company>(`${environment.fbDbUrl}/companies/${id}.json`)
      .pipe(
        map((company) => {
          return company ? { ...company, id } : undefined;
        })
      );
  }
}
