import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpServerService {

   headers= new HttpHeaders();


  constructor(private http: HttpClient) {
  this.headers.set('content-type', 'application/json; charset=utf-8')
      this.headers.set('Access-Control-Allow-Origin', '*');
  }

  get(url: string) {
    return this.http.get(`https://cert-school-backend.azurewebsites.net${url}`, {headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })} );
  }

  post(url: string, body:any): any {
    return this.http.post(`https://cert-school-backend.azurewebsites.net${url}`,body, {headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })}  );
  }

  delete(url: string): any {
    return this.http.delete(`https://cert-school-backend.azurewebsites.net${url}`, {headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })}  );
  }
  put(url: string, body: any): any {
    return this.http.put(`https://cert-school-backend.azurewebsites.net${url}`, body , {headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })} );
  }
}
