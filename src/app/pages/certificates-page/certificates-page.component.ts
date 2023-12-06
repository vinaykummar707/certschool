import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RouterService} from "../../services/router-service/router.service";
import {LocalStorageService} from "../../services/localstorage-service/local-storage.service";
import {StudentsService} from "../../services/students-service/students.service";
import {CertificateService} from "../../services/certificate-service/certificate.service";

@Component({
  selector: 'app-certificates-page',
  templateUrl: './certificates-page.component.html',
  styleUrls: ['./certificates-page.component.scss']
})
export class CertificatesPageComponent {

  user: any;
  certificateForm: FormGroup;
  certificateEditForm: FormGroup;
  certificates: any[] = [];
  showModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showError: any;
  dataLoaded: boolean = false;
  uploadType: string = 'create';
  certificateDeleteForm: FormGroup;


  constructor(
    private routerService: RouterService,
    private  ls: LocalStorageService, private ctService: CertificateService) {
    this.certificateForm = new FormGroup({
      StudentName: new FormControl('', Validators.required),
      FatherName: new FormControl('', Validators.required),
      FamilyName: new FormControl('', Validators.required),
      MobileNumber: new FormControl('', Validators.required),
      Address: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
      State: new FormControl('', Validators.required),
      GraduationDate: new FormControl('', Validators.required),
      SchoolId: new FormControl('this.user.schoolId', Validators.required),
    })
    this.certificateEditForm = new FormGroup({
      StudentName: new FormControl('', Validators.required),
      FatherName: new FormControl('', Validators.required),
      FamilyName: new FormControl('', Validators.required),
      MobileNumber: new FormControl('', Validators.required),
      Address: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
      State: new FormControl('', Validators.required),
      GraduationDate: new FormControl('', Validators.required),
      id: new FormControl('', Validators.required),
      isActive: new FormControl('', Validators.required),
      createdAt: new FormControl('', Validators.required),
      updatedAt: new FormControl('', Validators.required),
      SchoolId: new FormControl('', Validators.required),
    })

    this.certificateDeleteForm = new FormGroup({
      id: new FormControl()
    })


  }

 async ngOnInit() {
   this.user = await this.ls.getUser();
    this.routerService.setCurrentRoute = 'certificates';
    this.getAllStudents();
  }

  editStudent(certificate: any) {
    console.log(certificate);
    this.certificateEditForm.setValue(certificate);
    console.log(this.certificateEditForm);

    this.openEditModal();
  }

  getAllStudents() {
    this.dataLoaded = false;
    this.ctService.getAll(this.user.schoolId).subscribe({
      next: (value: any) => {
        this.certificates = value.results;
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



  getDate(date: string) {
    return new Date(date).toDateString();
  }

  addUser() {
    if(this.certificateForm.valid) {
      console.log(this.certificateForm.value)
      this.ctService.create(this.certificateForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.showModal = false;
            this.getAllStudents();
            this.certificateForm.reset();
          }
        })
    } else {
      this.showError = true;
      console.log(this.certificateForm);
    }
  }

  editUser() {
    if(this.certificateEditForm.valid) {
      this.ctService.updateOne(this.certificateEditForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.showEditModal = false;
            this.getAllStudents();
            this.certificateEditForm.reset();
          }
        })
    } else {
      this.showError = true;
    }
  }

  deleteModel(certificate: any) {
    this.showDeleteModal = true;
    this.certificateDeleteForm.controls['id'].setValue(certificate.id);
  }

  deleteUser() {
    this.ctService.deleteOne(this.certificateDeleteForm.controls['id'].value).subscribe(
      {
        next: (value: any) => {
          this.getAllStudents();
          this.showDeleteModal = false;
          this.certificateDeleteForm.reset();
        }
      }
    )
  }
}
