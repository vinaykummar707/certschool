import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localstorage-service/local-storage.service';
import {RouterService} from "../../services/router-service/router.service";
import {UsersService} from "../../services/users-service/users.service";
import {environment} from "../../../environment";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  show: boolean = true;
  user:any = null;
  env = environment;

  constructor(
    public routerService: RouterService,
    private localService:LocalStorageService, private router: Router, private userService: UsersService) {}

  async ngOnInit() {
    this.user = await  this.localService.getUser();
  }

  logout() {
    this.localService.deleteUser();
    this.router.navigate(['/login']);
  }
}
