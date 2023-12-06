import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionsPageComponent } from './sections-page.component';

describe('SectionsPageComponent', () => {
  let component: SectionsPageComponent;
  let fixture: ComponentFixture<SectionsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionsPageComponent]
    });
    fixture = TestBed.createComponent(SectionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
