import { Component } from '@angular/core';
import {LocalStorageService} from "../../services/localstorage-service/local-storage.service";
import { FormControl, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/services/users-service/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  showError: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  constructor(
    private userService: UsersService,
    private localService: LocalStorageService,
    private router: Router
  ) {

  }

  login() {
    this.showError = false;
    this.userService.loginUser(this.loginForm.value).subscribe({
      next: (value: any) => {
        console.log(value);
        if(value.results.length > 0) {
          this.localService.storeUser(value.results[0]);
          this.router.navigate(['/home']);
        } else {
          this.showError = true;
        }
      },
    });
  }

}
