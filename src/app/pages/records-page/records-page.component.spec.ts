import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsPageComponent } from './records-page.component';

describe('RecordsPageComponent', () => {
  let component: RecordsPageComponent;
  let fixture: ComponentFixture<RecordsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordsPageComponent]
    });
    fixture = TestBed.createComponent(RecordsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
