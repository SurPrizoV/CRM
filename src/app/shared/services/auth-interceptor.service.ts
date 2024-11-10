import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    req = req.clone({
      setParams: {
        auth: authService.token!,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('[Interceptor]:', error);
      if (error.status === 401 || error.status === 400) {
        authService.logout();
        router.navigate(['login']);
      }
      return throwError(() => error);
    })
  );
};
