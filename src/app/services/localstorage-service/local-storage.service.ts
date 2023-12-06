import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  isUserLoggedIn (): boolean {
    const user = localStorage.getItem('user');
    if(user) return true
    else return  false;
  }

  getUser() {
    return new  Promise((resolve,reject) => {
      if(localStorage.getItem('user') !== null)  {
        // @ts-ignore
        resolve(JSON.parse(localStorage.getItem('user')));
      } else {
        reject(null);
      }
    })
  }

  storeUser(user: any) {
   localStorage.setItem('user',  JSON.stringify(user));
  }

  deleteUser() {
    localStorage.removeItem('user');
    localStorage.clear();
  }


}
