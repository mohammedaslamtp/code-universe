import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { otpRequest } from 'src/app/stores/actions/generateOtp';
import { BehaviorSubject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

export const otpSentLoad = new BehaviorSubject<boolean>(false);
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnDestroy {
  error_msg?: string | boolean;
  remainingTime: number = 0;
  timeoutRunning: boolean = false;
  resendLoading: boolean = false;
  constructor(
    private userService: UserService,
    private store: Store,
    private router: Router
  ) {}

  otp = new FormGroup({
    otp: new FormControl('', [Validators.pattern(/^\d{6}$/)]),
  });

  // otp verification
  subs_verifyOtp!: Subscription;
  verifyOtpLoading: boolean = false;
  onSubmit() {
    this.verifyOtpLoading = true;
    let otpField: any = this.otp.get('otp')?.value;
    otpField = Number(otpField);
    this.subs_verifyOtp = this.userService
      .verifyOtp(otpField)
      .subscribe((res) => {
        this.verifyOtpLoading = false;
        if (res.valid && res.expired == false) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Your OTP verified',
          });
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        } else if (res.valid == false || res.expired == true) {
          if (!res.valid) {
            this.error_msg = 'Invalid OTP, try again..';
          }
          if (res.expired) {
            this.error_msg =
              'Your OTP expired it will valid only for 3 minutes, try again..';
          }
        }
      });
  }

  // regenerate/resend the otp
  resendOtp() {
    this.error_msg = false;
    this.close_alert();
    this.store.dispatch(otpRequest());
    this.otpSendLoading();
  }

  otpSendLoading() {
    otpSentLoad.subscribe((val) => {
      if (val) {
        this.resendLoading = true;
      } else {
        this.resendLoading = false;
        this.startTimeout();
      }
    });
  }

  // start timout:
  startTimeout() {
    this.remainingTime = 60; // Set the initial timeout duration in seconds
    this.timeoutRunning = true;
    const timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime === 0) {
        clearInterval(timer);
        this.timeoutRunning = false;
      }
    }, 1000);
  }

  close_alert() {
    let alert: any = document.getElementById('alert');
    this.error_msg = false;
    if (alert) alert.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.subs_verifyOtp?.unsubscribe();
  }
}
