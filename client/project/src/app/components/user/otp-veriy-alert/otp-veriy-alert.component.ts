import { Component, NgZone, OnInit } from '@angular/core';
import { coding } from 'src/app/services/shared-values.service';
import { UserService } from 'src/app/services/user.service';
import { generateOtpToggle } from '../generate-otp/generate-otp.component';

@Component({
  selector: 'app-otp-veriy-alert',
  templateUrl: './otp-veriy-alert.component.html',
  styleUrls: ['./otp-veriy-alert.component.css'],
})
export class OtpVeriyAlertComponent implements OnInit {
  constructor(private userService: UserService, private _ngZone: NgZone) {}

  otpInterval: any;
  ngOnInit(): void {
    this._ngZone.runOutsideAngular(() => {
      generateOtpToggle.next(false);
    });
    setTimeout(() => {
      if (this.userService.loggedIn()) {
        this.userService.getUserData().subscribe((res) => {
          if (res.otp_verified == false) {
            this.otpInterval = setInterval(() => {
              coding.subscribe((value) => {
                if (value) {
                  const alert = document.getElementById('otp_alert');
                  if (alert) alert.style.visibility = 'hidden';
                  if (alert) alert.style.opacity = '0';
                } else {
                  const alert = document.getElementById('otp_alert');
                  if (alert) alert.style.visibility = 'visible';
                  if (alert) alert.style.opacity = '1';
                }
              });
            }, 6000);
          } else {
            this.userService.otpAlertClose();
            clearInterval(this.otpInterval);
          }
        });
      } else {
        clearInterval(this.otpInterval);
        this.userService.otpAlertClose();
      }
    });
  }

  toggleGenrateOtp() {
    generateOtpToggle.next(true);
  }

  closeAlert() {
    const alert = document.getElementById('otp_alert');
    if (alert) alert.style.visibility = 'hidden';
    if (alert) alert.style.opacity = '0';
  }
}
