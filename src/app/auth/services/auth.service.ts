import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { FbAuthResponse, User, UserData } from '../../shared/interfaces';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get token(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const expDateStr = localStorage.getItem('fb-token-exp');
      if (!expDateStr) {
        return null;
      }
      const expDate = new Date(expDateStr);
      if (new Date() > expDate) {
        this.logout();
        return null;
      }
      return localStorage.getItem('fb-token');
    }
    return null;
  }

  login(user: User): Observable<FbAuthResponse | null> {
    user.returnSecureToken = true;
    return this.http
      .post<FbAuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        user
      )
      .pipe(
        tap(this.setToken.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  logup(user: User): Observable<FbAuthResponse | null> {
    user.returnSecureToken = true;
    return this.http
      .post<FbAuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
        user
      )
      .pipe(
        tap(this.setToken.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  saveUserData(userId: string, userData: UserData): Observable<any> {
    return this.http.put(
      `${environment.fbDbUrl}/managers/${userId}.json`,
      userData
    );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;
    if (message === 'INVALID_LOGIN_CREDENTIALS') {
      this.error$.next('Неверные данные');
    }
    return throwError(() => new Error(message));
  }

  private setToken(response: FbAuthResponse | null) {
    if (isPlatformBrowser(this.platformId)) {
      if (response) {
        const expDate = new Date(
          new Date().getTime() + +response.expiresIn * 1000
        );
        localStorage.setItem('fb-token', response.idToken);
        localStorage.setItem('fb-localId', response.localId);
        localStorage.setItem('fb-token-exp', expDate.toString());
      } else {
        localStorage.clear();
      }
    }
  }
}
