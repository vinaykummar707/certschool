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
  dataLoaded: boolean = true;
  uploadType: string = 'create';
  headers: string[]= [];
  eduPassed: any[] = [];
  eduStream: any[] = [];
  eduStreamFiltered: any[] = [];


  educationPassed: any = 'SSC';
  year: any = '2022';
  selectForm = new FormGroup({
    EducationPassed: new FormControl(),
    BoardStream: new FormControl(),
    year: new FormControl(),
  })


  constructor(
      private routerService: RouterService,
      private  ls: LocalStorageService, private stService: StudentsService, private certService:CertificateService) {
  }

  async ngOnInit() {
    this.user =await this.ls.getUser();
    this.routerService.setCurrentRoute = 'students';
    // this.getAllStudents();
    this.stService.getEduPassed('','').subscribe({
      next: ((value:any) => {
        this.eduPassed = value[0];
        this.stService.getEduStream('', '').subscribe({
          next: ((stream:any) => {
            this.eduStream =stream[0];
          })
        })
      })
    })
    this.selectForm.controls.EducationPassed.valueChanges.subscribe((value) => {
      console.log(value);
      this.onEduPassedSelected(value);
    });
  }

  onEduPassedSelected(code:any) {
    this.eduStreamFiltered = this.eduStream.filter((st:any) => (st.EducationPassed === code && st.Stream.length > 0));
  }



  getAllStudents() {
    this.students = [];
    this.dataLoaded = false;
    console.log(this.selectForm)
    this.stService.getTopStudents(this.selectForm.value).subscribe({
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
    this.certService.createCertificate(activity, 'education');
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
