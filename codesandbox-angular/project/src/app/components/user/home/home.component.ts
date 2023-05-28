import { Component, OnDestroy, OnInit } from '@angular/core';
import { generateOtpToggle } from '../generate-otp/generate-otp.component';
import { UserService } from 'src/app/services/user.service';
import { Subscription, filter } from 'rxjs';
import { Templates } from 'src/app/types/template_types';
import { USerData } from 'src/app/types/UserData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  otpToggle: boolean = false;
  templates?: Templates;
  templates_array: Subscription;
  UserData!: USerData;
  UserData_collecter: Subscription;
  yourWorks?: Templates;
  constructor(private _userService: UserService) {
    generateOtpToggle.subscribe((val) => {
      if (val == true) {
        this.otpToggle = true;
      } else if (val == false) {
        this.otpToggle = false;
      } else {
        this.otpToggle = false;
      }
    });
    this.templates_array = this._userService.getTemplates().subscribe(
      (templates: any) => {
        this.templates = templates.all_templates;
        setTimeout(() => {
          if (this.templates) {
            for (const el of this.templates) {
              this.trendingTemplateThumbnail(el.template_id);
            }
          }
        }, 100);
      },
      (err) => {
        console.log('template data error: ', err);
      }
    );
    this.UserData_collecter = this._userService
      .getUserData()
      .subscribe((data) => {
        this.UserData = data;
        this.yourWorks = this.templates?.filter(
          (val) => val.user._id === this.UserData._id
        );
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

  // view templates
  trendingTemplateThumbnail(id: string) {
    const iframes: NodeListOf<HTMLIFrameElement> =
      document.querySelectorAll('.www');
    const iframeArray: HTMLIFrameElement[] = Array.from(iframes);
    this._userService.reloadIframe(id).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        for (const el of iframeArray) {
          if (el.id == id) {
            el.src = url;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
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

  ngOnDestroy() {
    this.templates_array.unsubscribe();
    this.UserData_collecter.unsubscribe();
  }
}

