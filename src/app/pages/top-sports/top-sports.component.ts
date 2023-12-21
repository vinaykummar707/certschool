import { Component } from '@angular/core';
import {RouterService} from "../../services/router-service/router.service";
import {LocalStorageService} from "../../services/localstorage-service/local-storage.service";
import {StudentsService} from "../../services/students-service/students.service";
import {CertificateService} from "../../services/certificate-service/certificate.service";

@Component({
  selector: 'app-top-sports',
  templateUrl: './top-sports.component.html',
  styleUrls: ['./top-sports.component.scss']
})
export class TopSportsComponent {
  user: any;
  students: any[] = [];
  showError: any;
  dataLoaded: boolean = true;
  headers: string[]= [];
  sports: any = '';
  year: any = '';

  constructor(
      private routerService: RouterService,
      private  ls: LocalStorageService, private stService: StudentsService, private certService:CertificateService) {
  }

  async ngOnInit() {
    this.user =await this.ls.getUser();
    this.routerService.setCurrentRoute = 'students';
    // this.getAllStudents();
    // this.stService.getEduPassed('','').subscribe({
    //   next: ((value:any) => {
    //     this.eduPassed = value[0];
    //   })
    // })
  }

  getAllStudents() {
    this.students = [];

    this.dataLoaded = false;
    this.stService.getTopSports(this.sports, this.year).subscribe({
      next: (value: any) => {
        this.students = value[0];
        console.log(this.students[0]);
        if(this.students.length > 0) {
          this.headers = Object.keys(this.students[0]);
        }
        this.dataLoaded = true;
      }
    })
  }

  genCertificate(activity: any) {
    this.certService.createCertificate(activity, 'event');
  }

  getDate(date: string) {
    return new Date(date).toDateString();
  }
}
