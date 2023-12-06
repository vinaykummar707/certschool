import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {SignupPageComponent} from "./pages/signup-page/signup-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {authGuard, roleGuardAdmin, roleGuardUser} from "./guards/authGuard";
import {ActivitiesPageComponent} from "./pages/activities-page/activities-page.component";
import {ClassPageComponent} from "./pages/class-page/class-page.component";
import {UsersPageComponent} from "./pages/users-page/users-page.component";
import {StudentsPageComponent} from "./pages/students-page/students-page.component";
import {CertificatesPageComponent} from "./pages/certificates-page/certificates-page.component";
import {RecordsPageComponent} from "./pages/records-page/records-page.component";

const routes: Routes = [

  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'signup',
    component: SignupPageComponent
  },
  {
    path: 'registration',
    component: RecordsPageComponent
  },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'activities',
        pathMatch: 'full'
      },
      {
        path: 'activities',
        component: ActivitiesPageComponent,
        canActivate: [roleGuardUser]
      },
      {
        path: 'users',
        component: UsersPageComponent,
        canActivate:[roleGuardAdmin]
      },
      {
        path: 'students',
        component: StudentsPageComponent
      },
      {
        path: 'certificates',
        component: CertificatesPageComponent,
        canActivate: [roleGuardUser]
      },
      {
        path: 'records',
        component: RecordsPageComponent
      },
    ]
  },
  {
    path: '',
    redirectTo: '/home/activities',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
