import { Injectable } from '@angular/core';
import {calls} from "../callinterfaces";
import {HttpServerService} from "../http-service/http-server.service";
import {jsPDF} from "jspdf";
import {UsersService} from "../users-service/users.service";

@Injectable({
  providedIn: 'root'
})
export class CertificateService implements calls{
  config: any;

  constructor(private httpService: HttpServerService,  private us: UsersService) { }

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
  getAll(schoolId:string) {
    return this.httpService.get(`/certificate/all/${schoolId}`);
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
          format: [this.config.size.width, this.config.size.height]
        });

        const keys = Object.keys(this.config.printData);


        //
        keys.forEach((field: any) => {
          if (field === "studentName") {
            this.config.printData[field]['text'] = activity.FamilyName + " " +activity.StudentName
          }

          if (field === "fatherName") {
            this.config.printData[field]['text'] = activity.FatherName
          }
          if (field === "description") {
            this.config.printData[field]['text'] = this.getDescription(activity);
          }
          if (field === "date") {
            this.config.printData[field]['text'] = activity.PassedDate;
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
    return `${activity.EducationPassed == null ? '' : activity.EducationPassed }`;

  }
}
