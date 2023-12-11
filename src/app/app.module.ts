import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ClarityModule} from "@clr/angular";
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SignupPageComponent} from './pages/signup-page/signup-page.component';
import {HomePageComponent} from './pages/home-page/home-page.component';
import '@cds/core/icon/register.js';
import {
  accessibility2Icon, announcementIcon, assignUserIcon,
  boldIcon,
  buildingIcon,
  bundleIcon,
  certificateIcon,
  ClarityIcons, cogIcon,
  folderOpenIcon, logoutIcon, pencilIcon, plusIcon, starIcon, trashIcon,
  userIcon,
  usersIcon
} from '@cds/core/icon';
import {ActivitiesPageComponent} from './pages/activities-page/activities-page.component';
import {StudentsPageComponent} from './pages/students-page/students-page.component';
import {ClassPageComponent} from './pages/class-page/class-page.component';
import {SectionsPageComponent} from './pages/sections-page/sections-page.component';
import {IssueCertificatePageComponent} from './pages/issue-certificate-page/issue-certificate-page.component';
import {CertificatesPageComponent} from './pages/certificates-page/certificates-page.component';
import {RecordsPageComponent} from './pages/records-page/records-page.component';
import {UsersPageComponent} from './pages/users-page/users-page.component';
import {ProfilePageComponent} from './pages/profile-page/profile-page.component';
import {HttpClientModule} from "@angular/common/http";
import {HttpServerService} from "./services/http-service/http-server.service";
import { ClassesService } from './services/class-service/classes.service';

ClarityIcons.addIcons(
  pencilIcon, trashIcon,starIcon,
  plusIcon,userIcon, logoutIcon, cogIcon, usersIcon, buildingIcon, bundleIcon, certificateIcon, folderOpenIcon, announcementIcon, assignUserIcon)


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignupPageComponent,
    HomePageComponent,
    ActivitiesPageComponent,
    StudentsPageComponent,
    ClassPageComponent,
    SectionsPageComponent,
    IssueCertificatePageComponent,
    CertificatesPageComponent,
    RecordsPageComponent,
    UsersPageComponent,
    ProfilePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ClarityModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [ClassesService, HttpServerService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
