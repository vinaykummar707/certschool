import { Component } from '@angular/core';
import {HttpServerService} from "../../services/http-service/http-server.service";
import {ClassesService} from "../../services/class-service/classes.service";

@Component({
  selector: 'app-class-page',
  templateUrl: './class-page.component.html',
  styleUrls: ['./class-page.component.scss']
})
export class ClassPageComponent {

  classes: any[] = [];
  showAddClass: boolean = false;

  constructor(
    private http: HttpServerService,
    private  classService: ClassesService
  ) {
  }

  ngOnInit() {
    this.getAllClasses();
  }

  getAllClasses() {
      this.classService.getAll('6566adf3d203ed11e7c84adc').subscribe({
        next: (value: any) => {
          console.log(value);
          this.classes = value;
        }
      })
  }

  createClass() {
    this.showAddClass = true;
  }
}
