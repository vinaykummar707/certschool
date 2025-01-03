import { Injectable } from '@angular/core';
import { calls } from '../callinterfaces';
import { HttpServerService } from '../http-service/http-server.service';
import { jsPDF } from 'jspdf';
import { UsersService } from '../users-service/users.service';

@Injectable({
	providedIn: 'root',
})
export class CertificateService implements calls {
	config: any;

	constructor(
		private httpService: HttpServerService,
		private us: UsersService
	) {}

	create(body: any) {
		return this.httpService.post('/certificate/create', body);
	}
	getOne(id: string) {
		return this.httpService.get(`/certificate/${id}`);
	}
	deleteOne(id: string) {
		return this.httpService.delete(`/certificate/delete/${id}`);
	}
	updateOne(body: any) {
		return this.httpService.put(`/certificate/update`, body);
	}
	getAll(schoolId: string) {
		return this.httpService.get(`/certificate/all/${schoolId}`);
	}

	printAllCertificates(activities: any[], user: any) {
		console.log('====================================');
		console.log(activities);
		console.log('====================================');
		this.us.getConfig().subscribe({
			next: (value) => {
				this.config = value;

				// Create a single jsPDF instance
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

				let activityCount = 0;

				activities.forEach((activity, index) => {
					this.us.getCertDetails(activity.studentId).subscribe({
						next: (res: any) => {
							const details = res[0][0];
							const keys = Object.keys(details);

							// Update certificate data
							keys.forEach((field: any) => {
								if (this.config.printData[field]) {
									this.config.printData[field]['text'] = details[field];
								}
							});

							// Add content to the document
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

							// Add a new page for the next certificate, if not the last
							if (index < activities.length - 1) {
								doc.addPage();
							}

							const payload = {
								schoolId: user.schoolId,
								activityId: activity.activityId,
								userId: user.id,
								studentId: activity.studentId,
							};
							this.create(payload).subscribe({
								next: (value: any) => {
									console.log(value);
								},
							});

							activityCount++;

							// When all activities are processed
							if (activityCount === activities.length) {
								// Output the combined PDF as a blob
								const blob = doc.output('blob');

								// Create a URL and open the print dialog directly
								const blobURL = URL.createObjectURL(blob);
								const printWindow = window.open(blobURL);
								if (printWindow) {
									printWindow.onload = () => {
										printWindow.print(); // Automatically start printing
										printWindow.onafterprint = () => {
											printWindow.close(); // Close the print dialog window after printing
										};
									};
								}
							}
						},
						error: (err: any) => console.log(err),
					});
				});
			},
			error: (err: any) => console.log(err),
		});
	}

	createCertificate(activity: any, type: string) {
		console.log(activity);
		this.us.getConfig().subscribe({
			next: (value) => {
				console.log(this.config);
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

				this.us.getCertDetails(activity.studentId).subscribe({
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
			error: (err: any) => {
				console.log(err);
			},
		});
	}

	getDescription(activity: any, type: string) {
		switch (type) {
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
}
