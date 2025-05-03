import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../Data/Services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).isAuth

  if(isLoggedIn){
    return true
  }

  return inject(Router).createUrlTree(["/sign-in"])
};
