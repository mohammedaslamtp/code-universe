import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVeriyAlertComponent } from './otp-veriy-alert.component';

describe('OtpVeriyAlertComponent', () => {
  let component: OtpVeriyAlertComponent;
  let fixture: ComponentFixture<OtpVeriyAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpVeriyAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpVeriyAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
