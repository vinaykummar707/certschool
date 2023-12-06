import { Injectable } from '@angular/core';
import {calls} from "../callinterfaces";
import {HttpServerService} from "../http-service/http-server.service";

@Injectable({
  providedIn: 'root'
})
export class CertificateService implements calls{

  constructor(private httpService: HttpServerService) { }

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
}
