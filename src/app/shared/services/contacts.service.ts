import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Contact } from '../interfaces';
import { contacts } from '../links';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchContacts() {
    this.http
      .get<{ [key: string]: Contact }>(`${environment.fbDbUrl}/contacts.json`)
      .pipe(
        map((responseData) => {
          const contactsArray: Contact[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              contactsArray.push({ ...responseData[key], id: key });
            }
          }
          return contactsArray;
        })
      )
      .subscribe((contacts) => {
        this.contactsSubject.next(contacts);
      });
  }

  addContact(contact: Contact) {
    const contactWithImage = {
      ...contact,
      img: contacts[Object.keys(contacts)[Math.floor(Math.random() * 4)]],
    };
    this.http
      .post<{ name: string }>(
        `${environment.fbDbUrl}/contacts.json`,
        contactWithImage
      )
      .subscribe({
        next: (response) => {
          const newContact = { ...contactWithImage, id: response.name };
          this.contactsSubject.next([
            ...this.contactsSubject.value,
            newContact,
          ]);
        },
      });
  }

  updateContact(updatedContact: Contact) {
    this.http
      .put(
        `${environment.fbDbUrl}/contacts/${updatedContact.id}.json`,
        updatedContact
      )
      .subscribe({
        next: () => {
          const contacts = this.contactsSubject.value.map((contact) =>
            contact.id === updatedContact.id ? updatedContact : contact
          );
          this.contactsSubject.next(contacts);
        },
      });
  }

  getContactById(id: string): Observable<Contact | undefined> {
    return this.http
      .get<Contact>(`${environment.fbDbUrl}/contacts/${id}.json`)
      .pipe(
        map((contact) => {
          return contact ? { ...contact, id } : undefined;
        })
      );
  }
}
