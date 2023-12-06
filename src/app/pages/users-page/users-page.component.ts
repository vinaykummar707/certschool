import { Component } from '@angular/core';
import { RoleService } from '../../services/role-service/role.service';
import { UsersService } from 'src/app/services/users-service/users.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RouterService} from "../../services/router-service/router.service";
import {LocalStorageService} from "../../services/localstorage-service/local-storage.service";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
})
export class UsersPageComponent {

  roles: any[] = [];
  users: any[] = [];
  showAddUserDialog: boolean = false;
  userObject: any = {
    username: null,
    password: null,
    roleId: null,
    schoolId: '6566adf3d203ed11e7c84adc',
  };

  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    roleId: new FormControl('', Validators.required),
    schoolId: new FormControl(),
  });

  user:any;

  constructor(
    private roleService: RoleService,
    private userService: UsersService,
    public routerService: RouterService,
    public lsSevice: LocalStorageService
  ) {
    // this.getAllUsers();

  }

  async ngOnInit() {
    this.user = await this.lsSevice.getUser();
    console.log(this.user);
    this.routerService.setCurrentRoute = 'users';
    this.getAllUsers();
    this.getAllRoles();

  }

  addUser() {
    this.showAddUserDialog = true;
  }

  submitUser() {
    if(this.userForm.valid) {
      this.userForm.controls['schoolId'].setValue(this.user.schoolId);
      this.userService.addUser(this.userForm.value).subscribe({
        next: (value: any) => {
          this.userForm.controls.username.reset();
          this.userForm.controls.password.reset();
          this.userForm.controls.roleId.reset();
          this.getAllUsers();
        },
      });
    }
  }

  getAllRoles() {
    this.roleService.getAllRoles(this.user.schoolId).subscribe({
      next: (value: any) => {
        this.roles = value['results'];
      },
    });
  }

  deleteUser(user: any) {
    this.userService.deleteUser(user._id).subscribe({
      next: (value: any) => {
        this.getAllUsers();
      },
    });
  }

  getDate(date: string) {
    return new Date(date).toDateString();
  }

  getAllUsers() {
    this.userService.getAllUsers(this.user.schoolId).subscribe({
      next: (value: any) => {
        this.users = value['results'];
      },
    });
  }
}
