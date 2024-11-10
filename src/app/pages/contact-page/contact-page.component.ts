import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CrossComponent } from '../../shared/SVG/cross/cross.component';
import { ArrowDownComponent } from '../../shared/SVG/arrow-down-component/arrow.component';
import { PlusComponent } from '../../shared/SVG/plus/plus.component';
import { ToggleService } from '../../shared/services/toggle.service';
import { Company, Manager } from '../../shared/interfaces';
import { ManagersService } from '../../shared/services/managers.service';
import { ContactsService } from '../../shared/services/contacts.service';
import { CompaniesService } from '../../shared/services/companies.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CrossComponent,
    ArrowDownComponent,
    PlusComponent,
  ],
  providers: [ToggleService],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  contactId: string | null = null;
  contactData: string | null = null;
  isSelectOpen = false;
  isCompanySelectOpen = false;
  managers: Manager[] = [];
  companies: Company[] = [];
  selectedManagers: Manager[] = [];
  selectedCompanies: Company[] = [];
  contactImg: string | null = null;

  constructor(
    private eRef: ElementRef,
    private router: Router,
    private toggleService: ToggleService,
    private managerService: ManagersService,
    private contactsService: ContactsService,
    private companyService: CompaniesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.toggleService.initialize(this.eRef, () => this.closeModal());

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      patronymic: new FormControl(''),
      jobTitle: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      telegram: new FormControl('', Validators.required),
      facebook: new FormControl('', Validators.required),
    });

    this.managerService.managers$.subscribe((managers) => {
      this.managers = managers;
    });

    this.companyService.fetchCompanies();

    this.companyService.companies$.subscribe((companies) => {
      this.companies = companies;
    });

    this.route.paramMap.subscribe((params) => {
      this.contactId = params.get('id');
      if (this.contactId) {
        this.contactsService
          .getContactById(this.contactId)
          .subscribe((contact) => {
            if (contact) {
              this.form.patchValue(contact);
              this.selectedManagers = contact.managers ? contact.managers : [];
              this.selectedCompanies = contact.companies
                ? contact.companies
                : [];
              this.contactImg = contact.img ? contact.img : null;
              this.contactData = contact
                ? `${contact.name} ${contact.surname}`
                : null;
              this.contactImg = contact.img;
            }
          });
      }
    });
  }

  private updateCompanyData() {
    if (this.contactId) {
      const companyData = {
        ...this.form.value,
        managers: this.selectedManagers,
        companies: this.selectedCompanies,
      };
      this.contactsService.updateContact({
        ...companyData,
        id: this.contactId,
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const contactData = {
        ...this.form.value,
        id: this.contactId,
        managers: this.selectedManagers,
        companies: this.selectedCompanies,
        img: this.contactImg,
      };
      if (this.contactId) {
        this.contactsService.updateContact(contactData);
      } else {
        this.contactsService.addContact(contactData);
      }
      this.closeModal();
    }
  }

  onNavigate() {
    this.router.navigate(['/contragents/contragent']);
  }

  selectCompany(company: Company) {
    if (!this.selectedCompanies.find((c) => c.id === company.id)) {
      this.selectedCompanies.push(company);
      this.updateCompanyData();
    }
    this.isCompanySelectOpen = false;
  }

  removeCompany(company: Company) {
    this.selectedCompanies = this.selectedCompanies.filter(
      (c) => c.id !== company.id
    );
    this.updateCompanyData();
  }

  selectedManager(manager: Manager) {
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
    this.router.navigate(['/contacts']);
  }

  ngOnDestroy() {
    this.toggleService.destroy(this.eRef);
  }
}
