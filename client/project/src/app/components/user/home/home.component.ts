import { Component, OnDestroy, OnInit } from '@angular/core';
import { generateOtpToggle } from '../generate-otp/generate-otp.component';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Templates } from 'src/app/types/template_types';
import { USerData } from 'src/app/types/UserData';

export const Trending = new BehaviorSubject<boolean>(false);
export const Following = new BehaviorSubject<boolean>(false);
export const YourWorks = new BehaviorSubject<boolean>(false);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  otpToggle: boolean = false;
  templates!: Templates;
  UserData!: USerData;
  UserData_collector!: Subscription;
  yourWorks?: Templates;
  isTrendingTab: boolean = false;
  isFollowingTab: boolean = false;
  isYourWorkTab: boolean = false;
  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    Trending.subscribe((val) => {
      this.isTrendingTab = val;
    });
    Following.subscribe((val) => {
      this.isFollowingTab = val;
    });
    YourWorks.subscribe((val) => {
      this.isYourWorkTab = val;
    });
    generateOtpToggle.subscribe((val) => {
      this.otpToggle = val;
    });

    this.UserData_collector = this._userService
      .getUserData()
      .subscribe((data) => {
        this.UserData = data;
        this.yourWorks = this.templates?.filter(
          (val) => val.user._id === this.UserData._id
        );
      });
  }

  ngOnDestroy() {
    this.UserData_collector?.unsubscribe();
  }
}
