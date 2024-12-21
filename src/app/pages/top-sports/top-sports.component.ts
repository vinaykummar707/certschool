import { Component } from '@angular/core';
import { RouterService } from '../../services/router-service/router.service';
import { LocalStorageService } from '../../services/localstorage-service/local-storage.service';
import { StudentsService } from '../../services/students-service/students.service';
import { CertificateService } from '../../services/certificate-service/certificate.service';

@Component({
	selector: 'app-top-sports',
	templateUrl: './top-sports.component.html',
	styleUrls: ['./top-sports.component.scss'],
})
export class TopSportsComponent {
	user: any;
	students: any[] = [];
	showError: any;
	dataLoaded: boolean = true;
	headers: string[] = [];
	sports: any = '';
	year: any = '';
	unfiltered = [];
	certificateFilter = 'All';
	constructor(
		private routerService: RouterService,
		private ls: LocalStorageService,
		private stService: StudentsService,
		private certService: CertificateService
	) {}

	async ngOnInit() {
		this.user = await this.ls.getUser();
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
				this.unfiltered = value[0];
        this.students = this.unfiltered
				console.log(this.students[0]);
				if (this.students.length > 0) {
					this.headers = Object.keys(this.students[0]);
				}
				this.dataLoaded = true;
			},
		});
	}

  printAll(){
    this.certService.printAllCertificates(this.students, this.user);
  }

	onFilterChange() {
		switch (this.certificateFilter) {
			case 'All':
				this.students = this.unfiltered;
				break;
			case 'Issued':
				this.students = this.unfiltered.filter(
					(student: any) => student.CertificateIssued === 'Issued'
				);
				break;
			case 'Not Issued':
				this.students = this.unfiltered.filter(
					(student: any) => student.CertificateIssued === 'Not Issued'
				);
				break;
			default:
				break;
		}
	}

	genCertificate(activity: any) {
		const payload = {
			schoolId: this.user.schoolId,
			activityId: activity.activityId,
			userId: this.user.id,
			studentId: activity.studentId,
		};
		this.certService.create(payload).subscribe({
			next: (value: any) => {
				this.certService.createCertificate(activity, 'event');
				console.log(value);
			},
		});
	}

	getDate(date: string) {
		return new Date(date).toDateString();
	}
}
