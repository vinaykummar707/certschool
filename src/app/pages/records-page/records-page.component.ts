import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivityService} from "../../services/activity-service/activity.service";
import {StudentsService} from "../../services/students-service/students.service";

@Component({
  selector: 'app-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent {

  studentForm = new FormGroup({
    StudentName: new FormControl('', Validators.required),
    FatherName: new FormControl('', Validators.required),
    FamilyName: new FormControl('', Validators.required),
    MobileNumber: new FormControl(''),
    Address: new FormControl(''),
    City: new FormControl(''),
    State: new FormControl(''),
    GraduationDate: new FormControl(''),
    SchoolId: new FormControl('skl1'),
  })

  activityForm = new FormGroup({
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
    ActivityType: new FormControl('education'),
    schoolId: new FormControl('skl1'),
  })
  dataSubmitted: boolean = false;
  showLoader: Boolean = false;

  constructor(private atService: ActivityService, private stService: StudentsService) {
  }

  addStudent() {
    if(this.studentForm.valid) {
      console.log(this.studentForm.value)
      this.showLoader = true;
      this.stService.create(this.studentForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.addActivity(value);
          }
        })
    } else {
      console.log(this.studentForm);
    }
  }

  addActivity(student: any) {
    if (this.activityForm.valid) {
      this.activityForm.controls['StudentId'].setValue(student.id);
      console.log(this.activityForm.value)
      this.atService.create(this.activityForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.activityForm.reset();
            this.studentForm.reset();
            this.activityForm.controls['ActivityType'].setValue('education');
            this.dataSubmitted = true;
            this.showLoader = false;
          }
        })
    } else {
      console.log(this.activityForm);
    }
  }

}
