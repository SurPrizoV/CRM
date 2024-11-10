import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Manager } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManagersService {
  private managersSubject = new BehaviorSubject<Manager[]>([]);
  managers$ = this.managersSubject.asObservable();
  currentUser$ = new BehaviorSubject<Manager | null>(null);

  constructor(private http: HttpClient) {}

  fetchManagers() {
    this.http
      .get<{ [key: string]: Manager }>(`${environment.fbDbUrl}/managers.json`)
      .pipe(
        map((responseData) => {
          const managersArray: Manager[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              managersArray.push({ ...responseData[key], id: key });
            }
          }
          return managersArray;
        })
      )
      .subscribe((managers) => {
        this.managersSubject.next(managers);
      });
  }

  fetchCurrentUser() {
    const currentUserId = localStorage.getItem('fb-localId');
    if (currentUserId) {
      this.managers$.subscribe((managers) => {
        const currentUser =
          managers.find((manager) => manager.id === currentUserId) || null;
        this.currentUser$.next(currentUser);
      });
    }
  }
}
