import { Injectable } from '@angular/core';
import { HttpServerService } from '../http-service/http-server.service';
import { calls } from '../callinterfaces';
import {id} from "@cds/core/internal";

@Injectable({
  providedIn: 'root'
})
export class SectionService implements calls {


  constructor(private httpService: HttpServerService) { }
  getOne(id: string) {
    return this.httpService.get(`/section/${id}`);
  }
  deleteOne(id: string) {
    return this.httpService.get(`/section/delete/${id}`);
  }
  updateOne(id: string, body: any) {
    return this.httpService.put(`/section/${id}`, body);
  }
  getAll(schoolId:string) {
    return this.httpService.get(`/section/all/${schoolId}`);
  }

  create(body: any): any {
  }

}
