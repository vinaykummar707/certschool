import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCertificatePageComponent } from './issue-certificate-page.component';

describe('IssueCertificatePageComponent', () => {
  let component: IssueCertificatePageComponent;
  let fixture: ComponentFixture<IssueCertificatePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueCertificatePageComponent]
    });
    fixture = TestBed.createComponent(IssueCertificatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
