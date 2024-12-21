import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LocalStorageService} from "../../services/localstorage-service/local-storage.service";
import {StudentsService} from "../../services/students-service/students.service";
import {RouterService} from "../../services/router-service/router.service";

@Component({
	selector: 'app-students-page',
	templateUrl: './students-page.component.html',
	styleUrls: ['./students-page.component.scss'],
})
export class StudentsPageComponent {
	user: any;
	students: any[] = [];
	showModal: boolean = false;
	showEditModal: boolean = false;
	showDeleteModal: boolean = false;
	showError: any;
	dataLoaded: boolean = false;
	uploadType: string = 'create';
	studentForm = new FormGroup({
		StudentName: new FormControl('', Validators.required),
		FatherName: new FormControl('', Validators.required),
		FamilyName: new FormControl('', Validators.required),
		MobileNumber: new FormControl('', Validators.required),
		Address: new FormControl(''),
		City: new FormControl(''),
		State: new FormControl(''),
		SchoolId: new FormControl(''),
		verified: new FormControl(false),
	});
	studentEditForm = new FormGroup({
		StudentName: new FormControl('', Validators.required),
		FatherName: new FormControl('', Validators.required),
		FamilyName: new FormControl('', Validators.required),
		MobileNumber: new FormControl('', Validators.required),
		Address: new FormControl(''),
		City: new FormControl(''),
		State: new FormControl(''),
		id: new FormControl('', Validators.required),
		isActive: new FormControl('', Validators.required),
		createdAt: new FormControl('', Validators.required),
		updatedAt: new FormControl('', Validators.required),
		SchoolId: new FormControl('', Validators.required),
		verified: new FormControl(),
	});

	studentDeleteForm = new FormGroup({
		id: new FormControl(),
	});

	constructor(
		private routerService: RouterService,
		private ls: LocalStorageService,
		private stService: StudentsService
	) {}

	async ngOnInit() {
		this.user = await this.ls.getUser();
		this.routerService.setCurrentRoute = 'students';
		this.getAllStudents();
	}

	editStudent(student: any) {
		console.log(student);
		this.studentEditForm.setValue(student);
		console.log(this.studentEditForm);

		this.openEditModal();
	}

	getAllStudents() {
		// this.dataLoaded = false;
		this.stService.getAll(this.user.schoolId).subscribe({
			next: (value: any) => {
				this.students = value.results;
				this.dataLoaded = true;
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

	getDate(date: string) {
		return new Date(date).toDateString();
	}

	addUser() {
		if (this.studentForm.valid) {
			console.log(this.studentForm.value);
			this.studentForm.controls['SchoolId'].setValue(this.user.schoolId);
			this.stService.create(this.studentForm.value).subscribe({
				next: (value: any) => {
					console.log(value);
					this.showModal = false;
					this.getAllStudents();
					this.studentForm.reset();
				},
			});
		} else {
			this.showError = true;
			console.log(this.studentForm);
			this.studentForm.markAllAsTouched();
		}
	}

	editUser() {
		if (this.studentEditForm.valid) {
			this.stService.updateOne(this.studentEditForm.value).subscribe({
				next: (value: any) => {
					console.log(value);
					this.showEditModal = false;
					this.getAllStudents();
					this.studentEditForm.reset();
				},
			});
		} else {
			this.showError = true;
		}
	}

	deleteModel(student: any) {
		this.showDeleteModal = true;
		this.studentDeleteForm.controls['id'].setValue(student.id);
	}

	deleteUser() {
		this.stService
			.deleteOne(this.studentDeleteForm.controls['id'].value)
			.subscribe({
				next: (value: any) => {
					this.getAllStudents();
					this.showDeleteModal = false;
					this.studentDeleteForm.reset();
				},
			});
	}
}
