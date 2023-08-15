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
          if (this.userService.loggedIn()) {
            if (res.otp_verified == false) {
              this.otpInterval = setInterval(() => {
                coding.subscribe((value) => {
                  if (value) {
                    let alert: any = document.getElementById('otp_alert');
                    if (alert) alert.style.display = 'none';
                  } else {
                    let alert: any = document.getElementById('otp_alert');
                    if (alert) alert.style.display = 'block';
                  }
                });
              }, 5000);
            } else {
              this.userService.otpAlertClose();
              clearInterval(this.otpInterval);
            }
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
    let alert: any = document.getElementById('otp_alert');
    if (alert) alert.style.display = 'none';
  }
}
