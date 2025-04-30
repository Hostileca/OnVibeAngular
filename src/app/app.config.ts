import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, RouteReuseStrategy, RouterModule} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {authInterceptor} from './Interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    [CookieService]
  ]
};
