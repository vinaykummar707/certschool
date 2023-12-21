import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SscModelStudentsComponent } from './ssc-model-students.component';

describe('SscModelStudentsComponent', () => {
  let component: SscModelStudentsComponent;
  let fixture: ComponentFixture<SscModelStudentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SscModelStudentsComponent]
    });
    fixture = TestBed.createComponent(SscModelStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
