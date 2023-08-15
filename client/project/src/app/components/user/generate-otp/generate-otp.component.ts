import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { otpRequest } from 'src/app/stores/actions/generateOtp';
import { appStateInterface } from 'src/app/types/appState';

export const generateOtpToggle = new BehaviorSubject<boolean>(false);
export const genrateOptLoading = new BehaviorSubject<boolean>(false);

@Component({
  selector: 'app-generate-otp',
  templateUrl: './generate-otp.component.html',
  styleUrls: ['./generate-otp.component.css'],
})
export class GenerateOtpComponent implements OnInit, OnDestroy {
  toggle: boolean = false;
  loading: boolean = false;
  subs_genrateOtpLoading!: Subscription;
  constructor(private store: Store<appStateInterface>) {}
  ngOnInit(): void {
    generateOtpToggle.subscribe((val) => {
      if (val == false) {
        this.toggle = false;
      } else if (val == true) {
        this.toggle = true;
      } else {
        this.toggle = false;
      }
    });

    // activating loading
    this.subs_genrateOtpLoading = genrateOptLoading.subscribe((val) => {
      if (val) {
        this.loading = true;
      } else {
        this.closeModal();
      }
    });
  }

  // to generate new otp
  generateOtp() {
    this.store.dispatch(otpRequest());
  }

  closeModal() {
    generateOtpToggle.next(false);
  }

  ngOnDestroy() {
    this.toggle = false;
  }
}
