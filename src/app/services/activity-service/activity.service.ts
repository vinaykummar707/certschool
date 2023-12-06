import { Injectable } from '@angular/core';
import { calls } from '../callinterfaces';
import { HttpServerService } from '../http-service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService implements calls {

  constructor(private httpService: HttpServerService) {

  }

  create(body: any) {
    return this.httpService.post('/activity/create', body);
  }
  getOne(id: string) {
    return this.httpService.get(`/activity/${id}`);
  }
  deleteOne(id: string) {
    return this.httpService.delete(`/activity/delete/${id}`);
  }
  updateOne(body: any) {
    return this.httpService.put(`/activity/update`, body);
  }
  getAll(activityType:string) {
    return this.httpService.get(`/activity/all/${activityType}`);
  }

  getAllActivity(activityType:string, schoolId: string) {
    return this.httpService.get(`/activity/all/${activityType}/${schoolId}`);
  }

}
