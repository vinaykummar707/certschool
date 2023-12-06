import { Injectable } from '@angular/core';
import { calls } from '../callinterfaces';
import { HttpServerService } from '../http-service/http-server.service';
import {id} from "@cds/core/internal";

@Injectable({
  providedIn: 'root'
})
export class ClassesService implements calls {

  constructor(private httpService: HttpServerService) { }
  getOne(id: string) {
    return this.httpService.get(`/class/${id}`);
  }
  deleteOne(id: string) {
    return this.httpService.get(`/class/delete/${id}`);
  }
  updateOne(body: any) {
    return this.httpService.put(`/class/${id}`, body);
  }
  getAll(schoolId:string) {
    return this.httpService.get(`/class/all/${schoolId}`);
  }

  create(body: any): any {
  }
}
