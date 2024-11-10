import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CrossComponent } from '../../shared/SVG/cross/cross.component';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToggleService } from '../../shared/services/toggle.service';
import { CompanyComponent } from '../../shared/SVG/company/company.component';
import { ArrowDownComponent } from '../../shared/SVG/arrow-down-component/arrow.component';
import { PlusComponent } from '../../shared/SVG/plus/plus.component';
import { Manager } from '../../shared/interfaces';
import { ManagersService } from '../../shared/services/managers.service';
import { CompaniesService } from '../../shared/services/companies.service';

@Component({
  selector: 'app-contragent',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CrossComponent,
    CompanyComponent,
    ArrowDownComponent,
    PlusComponent,
  ],
  providers: [ToggleService],
  templateUrl: './contragent-page.component.html',
  styleUrl: './contragent-page.component.scss',
})
export class ContragentPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  companyId: string | null = null;
  isSelectOpen = false;
  managers: Manager[] = [];
  selectedManagers: Manager[] = [];
  companyImg: string | null = null;

  constructor(
    private eRef: ElementRef,
    private router: Router,
    private toggleService: ToggleService,
    private managerService: ManagersService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.toggleService.initialize(this.eRef, () => {
      this.closeModal();
    });

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      activity: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      site: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
    });

    this.managerService.managers$.subscribe((managers) => {
      this.managers = managers;
    });

    this.route.paramMap.subscribe((params) => {
      this.companyId = params.get('id');
      if (this.companyId) {
        this.companiesService
          .getCompanyById(this.companyId)
          .subscribe((company) => {
            if (company) {
              this.form.patchValue(company);
              this.selectedManagers = company.managers ? company.managers : [];
              this.companyImg = company.img ? company.img : null;
            }
          });
      }
    });
  }

  private updateCompanyData() {
    if (this.companyId) {
      const companyData = {
        ...this.form.value,
        managers: this.selectedManagers,
      };
      this.companiesService.updateCompany({
        ...companyData,
        id: this.companyId,
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const companyData = {
        ...this.form.value,
        managers: this.selectedManagers,
        id: this.companyId,
      };
      if (this.companyId) {
        this.companiesService.updateCompany(companyData);
      } else {
        this.companiesService.addCompany(companyData);
      }
    }
    this.closeModal();
  }

  selectManager(manager: Manager) {
    if (!this.selectedManagers.find((m) => m.id === manager.id)) {
      this.selectedManagers.push(manager);
      this.updateCompanyData();
    }
    this.isSelectOpen = false;
  }

  removeManager(manager: Manager) {
    this.selectedManagers = this.selectedManagers.filter(
      (m) => m.id !== manager.id
    );
    this.updateCompanyData();
  }

  closeModal() {
    this.router.navigate(['/contragents']);
  }

  ngOnDestroy() {
    this.toggleService.destroy(this.eRef);
  }
}
