import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivityService } from 'src/app/services/activity-service/activity.service';
import { LocalStorageService } from 'src/app/services/localstorage-service/local-storage.service';
import { StudentsService } from '../../services/students-service/students.service';
import { RouterService } from '../../services/router-service/router.service';
import { CertificateService } from '../../services/certificate-service/certificate.service';
import { jsPDF, TextOptionsLight } from 'jspdf';
import { UsersService } from '../../services/users-service/users.service';

@Component({
	selector: 'app-activities-page',
	templateUrl: './activities-page.component.html',
	styleUrls: ['./activities-page.component.scss'],
})
export class ActivitiesPageComponent {
	user: any;
	activitys: any[] = [];
	showModal: boolean = false;
	showEditModal: boolean = false;
	showDeleteModal: boolean = false;
	showError: any;
	dataLoaded: boolean = false;
	uploadType: string = 'create';
	activityType: string = 'education';
	students: any[] = [];
	config: any;
	eduPassed: any[] = [];
	eduStream: any[] = [];
	eduStreamFiltered: any[] = [];
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
		ActivityType: new FormControl(),
		schoolId: new FormControl(),
		SchoolName: new FormControl(),
		SchoolAddress: new FormControl(),
		StudyingSsc: new FormControl(),
	});
	activityEditForm = new FormGroup({
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
	});
	activityDeleteForm = new FormGroup({
		id: new FormControl(),
	});

	selectForm = new FormGroup({
		EducationPassed: new FormControl(),
		BoardStream: new FormControl(),
	});

	selectEditForm = new FormGroup({
		EducationPassed: new FormControl(),
		BoardStream: new FormControl(),
	});

	constructor(
		private certService: CertificateService,
		private routerService: RouterService,
		private ls: LocalStorageService,
		private atService: ActivityService,
		private stService: StudentsService,
		private us: UsersService
	) {}

	async ngOnInit() {
		this.stService.getEduPassed('', '').subscribe({
			next: (value: any) => {
				this.eduPassed = value[0];
				this.stService.getEduStream('', '').subscribe({
					next: (stream: any) => {
						this.eduStream = stream[0];
					},
				});
			},
		});
		this.user = await this.ls.getUser();
		this.routerService.setCurrentRoute = 'activity';
		this.getAllActivities('all');
		this.getAllStudents();
		this.activityForm.controls.ActivityType.valueChanges.subscribe((value) => {
			if (this.activityForm.controls.ActivityType.value === 'education') {
				this.resetEvent();
				this.resetSsc();
				this.activityForm.controls.TotalMarks.addValidators([
					Validators.required,
				]);
				this.activityForm.updateValueAndValidity();
			}
			if (this.activityForm.controls.ActivityType.value === 'event') {
				this.resetEducation();
				this.resetSsc();
				this.activityForm.controls.EventTitle.addValidators([
					Validators.required,
				]);
				this.activityForm.controls.EventReward.addValidators([
					Validators.required,
				]);
				this.activityForm.updateValueAndValidity();
			}
			if (this.activityForm.controls.ActivityType.value === 'ssc') {
				this.resetEducation();
				this.resetEvent();
				this.activityForm.controls.StudyingSsc.addValidators([
					Validators.required,
				]);
				this.activityForm.controls.SchoolName.addValidators([
					Validators.required,
				]);
				this.activityForm.updateValueAndValidity();
			}
			console.log(this.activityForm);
		});

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
		});

		//edit form

		this.activityEditForm.controls.ActivityType.valueChanges.subscribe(
			(value) => {
				if (this.activityEditForm.controls.ActivityType.value === 'education') {
					this.resetEvent();
					this.resetSsc();
					this.activityEditForm.controls.TotalMarks.addValidators([
						Validators.required,
					]);
					this.activityEditForm.updateValueAndValidity();
				}
				if (this.activityEditForm.controls.ActivityType.value === 'event') {
					this.resetEducation();
					this.resetSsc();
					this.activityEditForm.controls.EventTitle.addValidators([
						Validators.required,
					]);
					this.activityEditForm.controls.EventReward.addValidators([
						Validators.required,
					]);
					this.activityEditForm.updateValueAndValidity();
				}
				if (this.activityEditForm.controls.ActivityType.value === 'ssc') {
					this.resetEducation();
					this.resetEvent();
					this.activityEditForm.controls.StudyingSsc.addValidators([
						Validators.required,
					]);
					this.activityEditForm.controls.SchoolName.addValidators([
						Validators.required,
					]);
					this.activityEditForm.updateValueAndValidity();
				}
				console.log(this.activityEditForm);
			}
		);

		this.selectEditForm.controls.EducationPassed.valueChanges.subscribe(
			(value) => {
				console.log(value);
				if (value !== 'Other') {
					this.activityEditForm.controls.EducationPassed.setValue(value);
				} else {
					this.activityEditForm.controls.EducationPassed.reset();
					this.activityEditForm.controls.BoardStream.reset();
				}
				this.onEduPassedSelected(value);
			}
		);
		this.selectEditForm.controls.BoardStream.valueChanges.subscribe((value) => {
			console.log(value);
			if (value !== 'Other') {
				this.activityEditForm.controls.BoardStream.setValue(value);
			}
		});
	}

	resetEvent() {
		this.activityForm.controls.EventTitle.reset();
		this.activityForm.controls.EventDescription.reset();
		this.activityForm.controls.EventReward.reset();
		this.activityForm.controls.EventTitle.removeValidators([
			Validators.required,
		]);
		this.activityForm.controls.EventDescription.removeValidators([
			Validators.required,
		]);
		this.activityForm.controls.EventReward.removeValidators([
			Validators.required,
		]);
	}

	resetEducation() {
		this.activityForm.controls.EducationPassed.reset();
		this.activityForm.controls.BoardType.reset();
		this.activityForm.controls.BoardStream.reset();
		this.activityForm.controls.Grade.reset();
		this.activityForm.controls.TotalMarks.reset();
		this.activityForm.controls.Percentage.reset();
		this.activityForm.controls.EducationPassed.removeValidators([
			Validators.required,
		]);
		this.activityForm.controls.BoardType.removeValidators([
			Validators.required,
		]);
		this.activityForm.controls.BoardStream.removeValidators([
			Validators.required,
		]);
		this.activityForm.controls.Grade.removeValidators([Validators.required]);
		this.activityForm.controls.TotalMarks.removeValidators([
			Validators.required,
		]);
		this.activityForm.controls.Percentage.removeValidators([
			Validators.required,
		]);
	}

	resetSsc() {
		this.activityForm.controls.StudyingSsc.reset();
		this.activityForm.controls.SchoolName.reset();
		this.activityForm.controls.SchoolAddress.reset();
		this.activityForm.controls.StudyingSsc.removeValidators([
			Validators.required,
		]);
		this.activityForm.controls.SchoolName.removeValidators([
			Validators.required,
		]);
		this.activityForm.controls.SchoolAddress.removeValidators([
			Validators.required,
		]);
	}

	onEduPassedSelected(code: any) {
		this.eduStreamFiltered = this.eduStream.filter(
			(st: any) => st.EducationPassed === code && st.Stream.length > 0
		);
	}

	getConfig() {}

	createCertificate(activity: any) {
		console.log(activity);
		this.us.getConfig().subscribe({
			next: (value) => {
				this.config = value;
				const doc = new jsPDF({
					orientation: this.config.orientation,
					unit: this.config.unit,
					format: [this.config.size.width, this.config.size.height],
				});
				doc.addFont(
					`./assets/fonts/EBGaramond-VariableFont_wght.ttf`,
					'EB_Garamond',
					'normal'
				);
				doc.addFont(
					`./assets/fonts/LibreBaskerville-Regular.ttf`,
					'Libre_Baskerville',
					'normal'
				);
				doc.addFont(
					`./assets/fonts/LibreCaslonText-Regular.ttf`,
					'Libre_Caslon_Text',
					'normal'
				);
				doc.addFont(
					`./assets/fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf`,
					'Nunito_Sans',
					'normal'
				);
				doc.addFont(
					`./assets/fonts/OpenSans-VariableFont_wdth,wght.ttf`,
					'Open_Sans',
					'normal'
				);
				this.us.getCertDetails(activity.student.id).subscribe({
					next: (res: any) => {
						const details = res[0][0];
						const keys = Object.keys(details);
						keys.forEach((field: any) => {
							if (field === 'StudentName') {
								this.config.printData[field]['text'] = details[field];
							}
							if (field === 'FatherName') {
								this.config.printData[field]['text'] = details[field];
							}
							if (field === 'Class_Event') {
								this.config.printData[field]['text'] = details[field];
							}
							if (field === 'PassYear') {
								this.config.printData[field]['text'] = details[field];
							}
						});
						keys.forEach((field: any) => {
							doc.setFont(this.config.font);
							doc.setTextColor(this.config.printData[field].color);
							doc.setFontSize(this.config.printData[field].fontSize);
							doc.text(
								this.config.printData[field].text,
								this.config.printData[field].x,
								this.config.printData[field].y,
								this.config.printData[field].transform
							);
						});
						console.log(this.config);
						doc.autoPrint();
						window.open(doc.output('bloburl'), '_blank');
					},
				});
			},
		});
	}

	getDescription(activity: any) {
		switch (activity.ActivityType) {
			case 'event':
				return `${activity.EventTitle == null ? '' : activity.EventTitle}`;
			// return `${activity.EventTitle == null ? '' : activity.EventTitle }  ${activity.EventDescription === null ? '' : '/ ' + activity.EventDescription }  ${activity.EventReward === null ? '' : '/ ' + activity.EventReward}`;
			case 'education':
				// return `${activity.EducationPassed == null ? '' : activity.EducationPassed }${activity.BoardType === null ? '' : '/' + activity.BoardType }${activity.BoardStream === null ? '' : '/' + activity.BoardStream}`;
				return `${
					activity.EducationPassed == null ? '' : activity.EducationPassed
				}`;
			default:
				return '';
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
			},
		});
	}

	editStudent(activity: any) {
		console.log(activity);
		this.activityEditForm.setValue(activity);
		this.selectEditForm.controls.BoardStream.setValue(activity.BoardStream);
		this.selectEditForm.controls.EducationPassed.setValue(
			activity.EducationPassed
		);
		console.log(this.activityEditForm);
		this.openEditModal();
	}

	getAllActivities(activityType: string) {
		this.dataLoaded = false;
		this.atService.getAllActivity(activityType, this.user.schoolId).subscribe({
			next: (value: any) => {
				this.activitys = value.results;
				this.dataLoaded = true;
			},
		});
	}

	createCertificateRecord(activity: any) {
		const payload = {
			schoolId: this.user.schoolId,
			activityId: activity.id,
			userId: this.user.id,
			studentId: activity.student.id,
		};
		this.certService.create(payload).subscribe({
			next: (value: any) => {
				this.createCertificate(activity);
				console.log(value);
			},
		});
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
			console.log(this.activityForm.value);
			this.activityForm.controls['schoolId'].setValue(this.user.schoolId);
			this.atService.create(this.activityForm.value).subscribe({
				next: (value: any) => {
					console.log(value);
					this.showModal = false;
					this.getAllActivities(this.activityType);
					this.activityForm.reset();
				},
			});
		} else {
			this.showError = true;
			console.log(this.activityForm);
			this.activityForm.markAllAsTouched();
		}
	}

	editUser() {
		if (this.activityEditForm.valid) {
			this.atService.updateOne(this.activityEditForm.value).subscribe({
				next: (value: any) => {
					console.log(value);
					this.showEditModal = false;
					this.getAllActivities(this.activityType);
					this.activityEditForm.reset();
				},
			});
		} else {
			this.showError = true;
		}
	}

	deleteModel(activity: any) {
		this.showDeleteModal = true;
		this.activityDeleteForm.controls['id'].setValue(activity.id);
	}

	deleteUser() {
		this.atService
			.deleteOne(this.activityDeleteForm.controls['id'].value)
			.subscribe({
				next: (value: any) => {
					this.getAllActivities(this.activityType);
					this.showDeleteModal = false;
					this.activityDeleteForm.reset();
				},
			});
	}

	onActivityTypeChange(event: any) {
		console.log(event.target.value);
		this.getAllActivities(event.target.value);
	}

	cancel() {
		this.showModal = false;
		this.activityForm.reset();
	}
}
