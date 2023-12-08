import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivityService} from 'src/app/services/activity-service/activity.service';
import {LocalStorageService} from 'src/app/services/localstorage-service/local-storage.service';
import {StudentsService} from "../../services/students-service/students.service";
import {RouterService} from "../../services/router-service/router.service";
import {CertificateService} from "../../services/certificate-service/certificate.service";
import {jsPDF, TextOptionsLight} from "jspdf";
import {UsersService} from "../../services/users-service/users.service";


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
    config: any;


    constructor(
        private certService: CertificateService,
        private routerService: RouterService,
        private ls: LocalStorageService, private atService: ActivityService, private stService: StudentsService, private us: UsersService) {
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
            SchoolName: new FormControl(),
            SchoolAddress: new FormControl(),
            StudyingSsc: new FormControl(),
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
            SchoolName: new FormControl(),
            SchoolAddress: new FormControl(),
            StudyingSsc: new FormControl(),
        })

        this.activityDeleteForm = new FormGroup({
            id: new FormControl()
        })

    }

    async ngOnInit() {
        this.user = await this.ls.getUser();
        this.routerService.setCurrentRoute = 'activity';
        this.getAllActivities('all');
        this.getAllStudents();
    }

    getConfig() {

    }

    createCertificate(activity: any) {
        console.log(activity);
        this.us.getConfig().subscribe({
            next: ((value) => {
                console.log(this.config);
                this.config = value;
                const doc = new jsPDF({
                    orientation: this.config.orientation,
                    unit: this.config.unit,
                    format: [this.config.size.height, this.config.size.width]
                });

                const keys = Object.keys(this.config.printData);


                //
                keys.forEach((field: any) => {
                    if (field === "studentName") {
                        this.config.printData[field]['text'] = activity.student.StudentName
                    }

                    if (field === "fatherName") {
                        this.config.printData[field]['text'] = activity.student.FatherName
                    }
                    if (field === "description") {
                        this.config.printData[field]['text'] = this.getDescription(activity);
                    }
                    if (field === "date") {
                        this.config.printData[field]['text'] = activity.EventDate;
                    }

                });

                keys.forEach((field: any) => {
                    doc.setTextColor(this.config.printData[field].color);
                    doc.setFontSize(this.config.printData[field].fontSize);
                    doc.text(this.config.printData[field].text, this.config.printData[field].x, this.config.printData[field].y, this.config.printData[field].transform);
                })


                console.log(this.config);

                doc.autoPrint();
                window.open(doc.output('bloburl'), '_blank');
            })
        })

    }

    getDescription(activity: any) {
        switch (activity.ActivityType) {
            case 'event':
                return `${activity.EventTitle} / ${activity.EventDescription} / ${activity.EventReward}`;
            case 'education':
                return `${activity.EducationPassed} / ${activity.BoardType} / ${activity.BoardStream}`;
            default:
                return "";
        }
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

    createCertificateRecord(activity: any) {
        const payload = {
            schoolId: this.user.schoolId,
            activityId: activity.id,
            userId: this.user.id,
            studentId: activity.student.id
        }
        this.certService.create(payload).subscribe({
            next: (value: any) => {
                this.createCertificate(activity);
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
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
