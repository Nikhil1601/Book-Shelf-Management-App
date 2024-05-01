import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let routerService = inject(Router);
  if (authService.isAuthenticated()) {
    
    return true;
  }else{
  authService.logout();
  routerService.navigate(['/login']);
  return false;}
};
