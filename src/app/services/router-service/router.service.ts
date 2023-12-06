import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor() { }

  currentRoute = '';

  set setCurrentRoute (value: string) {
    this.currentRoute = value;
  }

  get getCurrentRoute() {
    return this.currentRoute;
  }
}
