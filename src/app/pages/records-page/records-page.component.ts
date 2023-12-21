import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivityService} from "../../services/activity-service/activity.service";
import {StudentsService} from "../../services/students-service/students.service";
import {environment} from "../../../environment";
import {UsersService} from "../../services/users-service/users.service";

@Component({
    selector: 'app-records-page',
    templateUrl: './records-page.component.html',
    styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent {

    eduPassed: any[] = [];
    eduStream: any[] = [];
    eduStreamFiltered: any[] = [];
    opEduPassed: string = '';
    opEduStream: string = '';
    config:any;

    studentForm = new FormGroup({
        StudentName: new FormControl('', Validators.required),
        FatherName: new FormControl('', Validators.required),
        FamilyName: new FormControl('', Validators.required),
        MobileNumber: new FormControl('', Validators.required),
        Address: new FormControl(''),
        City: new FormControl(''),
        State: new FormControl(''),
        SchoolId: new FormControl('skl1'),
    })

    selectForm = new FormGroup({
        EducationPassed: new FormControl(),
        BoardStream: new FormControl(),
    })

    activityForm = new FormGroup({
        StudentId: new FormControl(),
        EducationPassed: new FormControl(),
        BoardType: new FormControl(),
        BoardStream: new FormControl(),
        Grade: new FormControl(),
        TotalMarks: new FormControl(''),
        Percentage: new FormControl(),
        EventDate: new FormControl(),
        EventTitle: new FormControl(),
        EventDescription: new FormControl(),
        EventReward: new FormControl(),
        ActivityType: new FormControl('', Validators.required),
        schoolId: new FormControl('skl1'),
        SchoolName: new FormControl(''),
        SchoolAddress: new FormControl(''),
        StudyingSsc: new FormControl(''),
    })
    dataSubmitted: boolean = false;
    showLoader: Boolean = false;

    constructor(private atService: ActivityService, private stService: StudentsService, private us:UsersService) {

    }

    ngOnInit() {
        this.us.getConfig().subscribe({
            next: ((value) => {
                this.config = value;
                console.log(this.config)
            })
        })
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
        this.activityForm.controls.ActivityType.valueChanges.subscribe((value) => {
            if (this.activityForm.controls.ActivityType.value === 'education') {
                this.resetEvent();
                this.resetSsc();
                this.activityForm.controls.TotalMarks.addValidators([Validators.required]);
                this.activityForm.updateValueAndValidity();
            }
            if (this.activityForm.controls.ActivityType.value === 'event') {
                this.resetEducation();
                this.resetSsc()
                this.activityForm.controls.EventTitle.addValidators([Validators.required]);
                this.activityForm.controls.EventReward.addValidators([Validators.required]);
                this.activityForm.updateValueAndValidity();
            }
            if (this.activityForm.controls.ActivityType.value === 'ssc') {
                this.resetEducation();
                this.resetEvent();
                this.activityForm.controls.StudyingSsc.addValidators([Validators.required]);
                this.activityForm.controls.SchoolName.addValidators([Validators.required]);
                this.activityForm.updateValueAndValidity();
            }
            console.log(this.activityForm);
        })

        this.selectForm.controls.EducationPassed.valueChanges.subscribe((value) => {
            console.log(value);
            if (value !== 'Other') {
                this.activityForm.controls.EducationPassed.setValue(value);
            } else {
                this.activityForm.controls.EducationPassed.reset();
                this.activityForm.controls.BoardStream.reset();
            }
            this.onEduPassedSelected(value);
        });
        this.selectForm.controls.BoardStream.valueChanges.subscribe((value) => {
            console.log(value);
            if (value !== 'Other') {
                this.activityForm.controls.BoardStream.setValue(value);
            }
        })
    }


    resetEvent() {
        this.activityForm.controls.EventTitle.reset();
        this.activityForm.controls.EventDescription.reset();
        this.activityForm.controls.EventReward.reset();
        this.activityForm.controls.EventTitle.removeValidators([Validators.required]);
        this.activityForm.controls.EventDescription.removeValidators([Validators.required]);
        this.activityForm.controls.EventReward.removeValidators([Validators.required]);
    }

    resetEducation() {
        this.activityForm.controls.EducationPassed.reset();
        this.activityForm.controls.BoardType.reset();
        this.activityForm.controls.BoardStream.reset();
        this.activityForm.controls.Grade.reset();
        this.activityForm.controls.TotalMarks.reset();
        this.activityForm.controls.Percentage.reset();
        this.activityForm.controls.EducationPassed.removeValidators([Validators.required]);
        this.activityForm.controls.BoardType.removeValidators([Validators.required]);
        this.activityForm.controls.BoardStream.removeValidators([Validators.required]);
        this.activityForm.controls.Grade.removeValidators([Validators.required]);
        this.activityForm.controls.TotalMarks.removeValidators([Validators.required]);
        this.activityForm.controls.Percentage.removeValidators([Validators.required]);
    }

    resetSsc() {
        this.activityForm.controls.StudyingSsc.reset();
        this.activityForm.controls.SchoolName.reset();
        this.activityForm.controls.SchoolAddress.reset();
        this.activityForm.controls.StudyingSsc.removeValidators([Validators.required]);
        this.activityForm.controls.SchoolName.removeValidators([Validators.required]);
        this.activityForm.controls.SchoolAddress.removeValidators([Validators.required]);
    }


    onEduPassedSelected(code:any) {
        this.eduStreamFiltered = this.eduStream.filter((st:any) => (st.EducationPassed === code && st.Stream.length > 0));
    }

    addStudent() {
        console.log(this.studentForm);
        console.log(this.activityForm);

        if (this.studentForm.valid && this.activityForm.valid) {
            this.showLoader = true;

            this.stService.create(this.studentForm.value)
              .subscribe({
                next: (value: any) => {
                  console.log(value);
                  this.addActivity(value);
                }
              })
        } else {
            this.studentForm.markAllAsTouched();
            this.activityForm.markAllAsTouched();
            // console.log(this.studentForm);
            // console.log(this.activityForm)
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

    protected readonly environment = environment;
}
