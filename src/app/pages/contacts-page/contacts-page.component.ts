import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { catchError, Observable, of } from 'rxjs';
import { Contact } from '../../shared/interfaces';
import { ContactsService } from '../../shared/services/contacts.service';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterPipe],
  templateUrl: './contacts-page.component.html',
})
export class ContactsPageComponent implements OnInit {
  searchText: string = '';
  contacts$!: Observable<Contact[]>;
  jobTitleMap: { [key: string]: string } = {
    CEO: 'CEO',
    manager: 'Менеджер',
    SMM: 'SMM',
  };

  constructor(
    private router: Router,
    private contactsService: ContactsService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.contactsService.fetchContacts()
    this.contacts$ = this.contactsService.contacts$.pipe(
      catchError(() => of([]))
    );
    this.searchService.search$.subscribe((text) => {
      this.searchText = text;
    });
  }

  onNavigate(contactId: string) {
    this.router.navigate([`/contacts/contact/${contactId}`]);
  }
}
