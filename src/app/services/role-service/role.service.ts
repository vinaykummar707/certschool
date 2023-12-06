import { Injectable } from '@angular/core';
import {HttpServerService} from "../http-service/http-server.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpService: HttpServerService) { }

  getAllRoles(schoolId:string) {
    return this.httpService.get(`/role/all/${schoolId}`);
  }

  getAllUsers(schoolId:string) {
    return this.httpService.get(`/user/all/${schoolId}`);
  }
}
