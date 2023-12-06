import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageService} from "../services/localstorage-service/local-storage.service";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  if(localStorageService.isUserLoggedIn()) {
    return true
  }
  router.navigate(['/login'])
  return  false;
};


export const roleGuardAdmin: CanActivateFn = async () => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  if(localStorageService.isUserLoggedIn()) {
    const user:any  = await localStorageService.getUser();
    if(user !== null) {
      if (user.role.name === 'admin') {
        return true
      }
    }
  }
  router.navigate(['/home/activities'])
  return  false;
};

export const roleGuardUser: CanActivateFn = async () => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  if(localStorageService.isUserLoggedIn()) {
    const user:any  = await localStorageService.getUser();
    if(user !== null) {
      if (user.role.name === 'user' || user.role.name === 'admin') {
        return true
      }
    }
  }
  router.navigate(['/home/students'])
  return  false;
};
