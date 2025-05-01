import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import { AuthService } from '../Data/Services/auth.service';
import {BehaviorSubject, catchError, filter, switchMap, take, throwError} from 'rxjs';
import {Router} from '@angular/router';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (httpRequest, next) => {
  const authService = inject(AuthService);
  const tokens = authService.tokens;

  if (!tokens) {
    return next(httpRequest);
  }

  return next(AddAccessToken(httpRequest, tokens.accessToken.value)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return HandleTokenRefresh(authService, httpRequest, next);
      }
      return throwError(error);
    })
  );
};

const HandleTokenRefresh = (
  authService: AuthService,
  httpRequest: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshAuthToken().pipe(
      switchMap(response => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken.value);
        return next(AddAccessToken(httpRequest, response.accessToken.value));
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logout();
        inject(Router).navigateByUrl("/")
        return throwError(error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(AddAccessToken(httpRequest, token!)))
    );
  }
}

const AddAccessToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};
