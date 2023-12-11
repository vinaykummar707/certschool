import { Injectable } from '@angular/core';
import {HttpServerService} from "../http-service/http-server.service";
import { calls } from '../callinterfaces';

@Injectable({
  providedIn: 'root'
})
export class StudentsService implements calls {

  constructor(private httpService: HttpServerService) {

  }

  create(body: any) {
    return this.httpService.post('/student/create', body);
  }
  getOne(id: string) {
    return this.httpService.get(`/student/${id}`);
  }
  deleteOne(id: string) {
    return this.httpService.delete(`/student/delete/${id}`);
  }
  updateOne(body: any) {
    return this.httpService.put(`/student/update`, body);
  }
  getAll(schoolId:string) {
    return this.httpService.get(`/student/all/${schoolId}`);
  }
  getTopStudents(edu: string,year: string) {
    return this.httpService.get(`/top-students/${edu}/${year}`);
  }
  getEduPassed(edu: string,year: string) {
    return this.httpService.get(`/eduPassed`);
  }
  getEduStream(edu: string,year: string) {
    return this.httpService.get(`/eduStream`);
  }

}
