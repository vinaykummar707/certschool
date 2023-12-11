import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RouterService} from "../../services/router-service/router.service";
import {LocalStorageService} from "../../services/localstorage-service/local-storage.service";
import {StudentsService} from "../../services/students-service/students.service";
import {CertificateService} from "../../services/certificate-service/certificate.service";


@Component({
  selector: 'app-sections-page',
  templateUrl: './sections-page.component.html',
  styleUrls: ['./sections-page.component.scss']
})
export class SectionsPageComponent {
  user: any;
  students: any[] = [];
  showModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showError: any;
  dataLoaded: boolean = false;
  uploadType: string = 'create';
  headers: string[]= [];

  educationPassed: any = 'SSC';
  year: any = '2022';


  constructor(
      private routerService: RouterService,
      private  ls: LocalStorageService, private stService: StudentsService, private certService:CertificateService) {
  }

  async ngOnInit() {
    this.user =await this.ls.getUser();
    this.routerService.setCurrentRoute = 'students';
    this.getAllStudents();
  }



  getAllStudents() {
    // this.dataLoaded = false;
    this.stService.getTopStudents(this.educationPassed, this.year).subscribe({
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


  openModal() {
    this.showModal = true;
    this.showError = false;
  }

  openEditModal() {
    this.showEditModal = true;
    this.showError = false;
  }

  genCertificate(activity: any) {
    this.certService.createCertificate(activity);
  }


  getDate(date: string) {
    return new Date(date).toDateString();
  }

  // addUser() {
  //   if(this.studentForm.valid) {
  //     console.log(this.studentForm.value)
  //     this.studentForm.controls['SchoolId'].setValue(this.user.schoolId);
  //     this.stService.create(this.studentForm.value)
  //         .subscribe({
  //           next: (value: any) => {
  //             console.log(value);
  //             this.showModal = false;
  //             this.getAllStudents();
  //             this.studentForm.reset();
  //           }
  //         })
  //   } else {
  //     this.showError = true;
  //     console.log(this.studentForm);
  //   }
  // }

  // editUser() {
  //   if(this.studentEditForm.valid) {
  //     this.stService.updateOne(this.studentEditForm.value)
  //         .subscribe({
  //           next: (value: any) => {
  //             console.log(value);
  //             this.showEditModal = false;
  //             this.getAllStudents();
  //             this.studentEditForm.reset();
  //           }
  //         })
  //   } else {
  //     this.showError = true;
  //   }
  // }

  // deleteModel(student: any) {
  //   this.showDeleteModal = true;
  //   this.studentDeleteForm.controls['id'].setValue(student.id);
  // }

  // deleteUser() {
  //   this.stService.deleteOne(this.studentDeleteForm.controls['id'].value).subscribe(
  //       {
  //         next: (value: any) => {
  //           this.getAllStudents();
  //           this.showDeleteModal = false;
  //           this.studentDeleteForm.reset();
  //         }
  //       }
  //   )
  // }

}
