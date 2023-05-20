import { Component, OnInit } from '@angular/core';
import { generateOtpToggle } from '../generate-otp/generate-otp.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  otpToggle: boolean = false;
  constructor() {
    generateOtpToggle.subscribe((val) => {
      if (val == true) {
        this.otpToggle = true;
      } else if (val == false) {
        this.otpToggle = false;
      } else {
        this.otpToggle = false;
      }
    });
  }
  ngOnInit(): void {
    const tabs = document.querySelectorAll('.tabs li');
    const tabContent = document.querySelectorAll('.tab-content > div');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // remove active classes from all tabs and content
        tabs.forEach((tab) => tab.classList.remove('active'));
        tabContent.forEach((content) => content.classList.remove('active'));

        // add active class to clicked tab and corresponding content
        tab.classList.add('active');
        tabContent[index].classList.add('active');
      });
    });
  }

  toggleGenrateOtp() {
    generateOtpToggle.next(true);
    generateOtpToggle.subscribe((val) => {
      if (val == true) {
        this.otpToggle = true;
        console.log('otpToggle: ', this.otpToggle);
      } else if (val == false) {
        this.otpToggle = false;
      } else {
        this.otpToggle = false;
      }
    });
  }

}
