import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivityService} from 'src/app/services/activity-service/activity.service';
import {LocalStorageService} from 'src/app/services/localstorage-service/local-storage.service';
import {StudentsService} from "../../services/students-service/students.service";
import {RouterService} from "../../services/router-service/router.service";
import {CertificateService} from "../../services/certificate-service/certificate.service";
import {jsPDF, TextOptionsLight} from "jspdf";

@Component({
  selector: 'app-activities-page',
  templateUrl: './activities-page.component.html',
  styleUrls: ['./activities-page.component.scss']
})
export class ActivitiesPageComponent {


  user: any;
  activityForm: FormGroup;
  activityEditForm: FormGroup;
  activitys: any[] = [];
  showModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showError: any;
  dataLoaded: boolean = false;
  uploadType: string = 'create';
  activityDeleteForm: FormGroup;
  activityType: string = 'education';
  students: any[] = [];
  pdfPrintForm: FormGroup = new FormGroup({
    studentName: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
      transform:new FormControl(),
      color: new FormControl(),
      text: new FormControl(),
      fontSize: new FormControl(),
    }),
    fatherName: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
      transform:new FormControl(),
      color: new FormControl(),
      text: new FormControl(),
      fontSize: new FormControl(),
    }),
    event: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
      transform:new FormControl(),
      color: new FormControl(),
      text: new FormControl(),
      fontSize: new FormControl(),
    }),
    period: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
      transform:new FormControl(),
      color: new FormControl(),
      text: new FormControl(),
      fontSize: new FormControl(),
    }),
  });


  constructor(
    private certService: CertificateService,
    private routerService: RouterService,
    private ls: LocalStorageService, private atService: ActivityService, private stService: StudentsService) {
    this.activityForm = new FormGroup({
      StudentId: new FormControl(),
      EducationPassed: new FormControl(),
      BoardType: new FormControl(),
      BoardStream: new FormControl(),
      Grade: new FormControl(),
      TotalMarks: new FormControl(),
      Percentage: new FormControl(),
      EventDate: new FormControl(),
      EventTitle: new FormControl(),
      EventDescription: new FormControl(),
      EventReward: new FormControl(),
      ActivityType: new FormControl(),
      schoolId: new FormControl(),
    })
    this.activityEditForm = new FormGroup({
      StudentId: new FormControl(),
      EducationPassed: new FormControl(),
      BoardType: new FormControl(),
      BoardStream: new FormControl(),
      Grade: new FormControl(),
      TotalMarks: new FormControl(),
      Percentage: new FormControl(),
      EventDate: new FormControl(),
      EventTitle: new FormControl(),
      EventDescription: new FormControl(),
      EventReward: new FormControl(),
      ActivityType: new FormControl(),
      schoolId: new FormControl(),
      id: new FormControl(),
      isActive: new FormControl(),
      createdAt: new FormControl(),
      updatedAt: new FormControl(),
      student: new FormControl(),
    })

    this.activityDeleteForm = new FormGroup({
      id: new FormControl()
    })

    console.log(this.pdfPrintForm.value);


  }

 async ngOnInit() {
    this.user = await  this.ls.getUser();
    this.routerService.setCurrentRoute = 'activity';
    this.getAllActivities('all');
    this.getAllStudents();
  }

  createCertificate(data: any) {
   const printdata = [
     {
       x: 1,
       y: 1,
       transform: 0,
       color: '#d10c0c',
       text: "student",
       fontSize: 24
     }
   ];
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [10, 10]
    });

    printdata.forEach((data: any) => this.setTextOnPdf(doc,data));

    doc.save('test');
  }

  setTextOnPdf(doc: any, obj: any) {
    doc.setTextColor(obj.color);
    doc.setFontSize(obj.fontSize);
    doc.text(obj.text, obj.x, obj.y, obj.transform);
  }

  getAllStudents() {
    this.stService.getAll(this.user.schoolId).subscribe({
      next: (value: any) => {
        this.students = value.results;
      }
    })
  }

  editStudent(activity: any) {
    console.log(activity);
    this.activityEditForm.setValue(activity);
    console.log(this.activityEditForm);
    this.openEditModal();
  }

  getAllActivities(activityType: string) {
    this.dataLoaded = false;
    this.atService.getAllActivity(activityType, this.user.schoolId).subscribe({
      next: (value: any) => {
        this.activitys = value.results;
        this.dataLoaded = true;

      }
    })
  }

  createCertificateRecord(activity:any) {
    const payload = {
      schoolId: this.user.schoolId,
      activityId: activity.id,
      userId: this.user.id,
      studentId: activity.student.id
    }
    this.certService.create(payload).subscribe({
      next: (value: any) => {
        this.createCertificate('a');
        console.log(value);
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


  getDate(data: string) {
    const date = new Date(data);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }
  getDateCreated(data: string) {
    const date = new Date(data);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }

  addUser() {
    if (this.activityForm.valid) {
      console.log(this.activityForm.value)
      this.activityForm.controls['schoolId'].setValue(this.user.schoolId);
      this.atService.create(this.activityForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.showModal = false;
            this.getAllActivities(this.activityType);
            this.activityForm.reset();

          }
        })
    } else {
      this.showError = true;
      console.log(this.activityForm);
    }
  }

  editUser() {
    if (this.activityEditForm.valid) {
      this.atService.updateOne(this.activityEditForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.showEditModal = false;
            this.getAllActivities(this.activityType);
            this.activityEditForm.reset();
          }
        })
    } else {
      this.showError = true;
    }
  }

  deleteModel(activity: any) {
    this.showDeleteModal = true;
    this.activityDeleteForm.controls['id'].setValue(activity.id);
  }

  deleteUser() {
    this.atService.deleteOne(this.activityDeleteForm.controls['id'].value).subscribe(
      {
        next: (value: any) => {
          this.getAllActivities(this.activityType);
          this.showDeleteModal = false;
          this.activityDeleteForm.reset();
        }
      }
    )
  }

  onActivityTypeChange(event: any) {
    console.log(event.target.value);
    this.getAllActivities(event.target.value);
  }
}
