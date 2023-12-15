import { Injectable } from '@angular/core';
import { HttpServerService } from '../http-service/http-server.service';
import {config} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpService: HttpServerService) { }

  getAllUsers(schoolId:string) {
    return this.httpService.get(`/user/all/${schoolId}`);
  }

  getConfig() {
    return this.httpService.get(`config`);
  }

  setConfig(config: any) {
    return this.httpService.post(`/config` , config);
  }

  addUser(data:any) {
    return this.httpService.post(`/user/create`, data);
  }

  deleteUser(id: string) {
    return this.httpService.delete(`/user/delete/${id}`);
  }

  loginUser(data: any) {
    return this.httpService.post(`/user/login`, data);
  }
}
