import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localstorage-service/local-storage.service';
import {RouterService} from "../../services/router-service/router.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  show: boolean = true;
  user:any = null;

  constructor(
    public routerService: RouterService,
    private localService:LocalStorageService, private router: Router) {}

  async ngOnInit() {
    this.user = await  this.localService.getUser();
  }

  logout() {
    this.localService.deleteUser();
    this.router.navigate(['/login']);
  }
}
