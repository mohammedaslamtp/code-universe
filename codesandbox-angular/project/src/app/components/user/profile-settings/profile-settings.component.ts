import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { SettingsService } from 'src/app/services/settings.service';
import Swal from 'sweetalert2';
import { domain } from 'src/app/services/shared-values.service';
import { NgForm } from '@angular/forms';
import { socialMedia } from 'src/app/types/profileForms';
import { aboutData } from 'src/app/types/profileForms';
import { apiRes } from 'src/app/types/defulatApiRes';
import {
  generateOtpToggle,
} from '../generate-otp/generate-otp.component';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
})
export class ProfileSettingsComponent implements OnDestroy {
  subs_param: Subscription;
  subs_userdata!: Subscription;
  userName!: string;
  userId!: string;
  userData!: USerData;
  profilePath!: string;
  subs_ownerData!: Subscription;
  isProfileImage: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _mainService: MainService,
    private _settingsService: SettingsService,
    private _router: Router
  ) {
    this.subs_param = this._activatedRoute.params.subscribe((param) => {
      if (param['id'] && param['username']) {
        const username = param['username'];
        const userId = param['id'];
        this.subs_userdata = this._userService.getUserData(username).subscribe(
          (dataWithName) => {
            this.subs_ownerData = this._mainService
              .getUserData(userId)
              .subscribe(
                (dataWithId) => {
                  if (dataWithId._id === dataWithName._id) {
                    this.userName = dataWithId.full_name;
                    this.userId = dataWithId._id;
                    generateOtpToggle.subscribe((val) => {
                      if (val == false) {
                        this.otpToggle = false;
                      } else if (val == true) {
                        this.otpToggle = true;
                      } else {
                        this.otpToggle = false;
                      }
                    });
                    if (dataWithId.avatar != null) {
                      this.profilePath = `${domain}/${dataWithId.avatar}`;
                      this.isProfileImage = true;
                    } else {
                      this.isProfileImage = false;
                      this.profilePath =
                        '../../../../assets/images/defulat_profile_avatar_of_codebox_2023.png';
                    }
                    this.userData = dataWithId;
                  } else {
                    this._router.navigate(['**']);
                  }
                },
                (err) => {
                  this._router.navigate(['**']);
                }
              );
          },
          (err) => {
            this._router.navigate(['**']);
          }
        );
      }
    });
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  // profile image updation
  subs_profileUpdate!: Subscription;
  handleFileSelect(event: any) {
    this.subs_profileUpdate = this._settingsService
      .profileUpdate(event.target.files[0])
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.profilePath = `${domain}/${res.data.fileName}`;
            this.isProfileImage = true;
          }
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            showCloseButton: true,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: 'success',
            title: `${res.message}`,
          });
        },
        (err) => {
          if (err) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 4000,
              showCloseButton: true,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: err.error.status > 400 ? 'error' : 'warning',
              title: `${err.error.message}`,
            });
          }
        }
      );
  }

  openFilePicker() {
    this.fileInput.nativeElement.click();
  }

  // profile img remove option
  subs_removeProfileimg!: Subscription;
  removeImgLoading: boolean = false;
  removeProfile() {
    Swal.fire({
      imageUrl: this.profilePath,
      imageWidth: '150px',
      title: 'Do you want to remove this?',
      showCancelButton: true,
      confirmButtonText: 'Remove',
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeImgLoading = true;
        this.subs_removeProfileimg = this._settingsService
          .removeProfileImage()
          .subscribe(
            (res) => {
              this.userData = res.data;
              this.isProfileImage = false;
              this.removeImgLoading = false;
              this.profilePath =
                '../../../../assets/images/defulat_profile_avatar_of_codebox_2023.png';
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
                title: `${res.message}`,
              });
            },
            (err) => {
              if (err) {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 4000,
                  showCloseButton: true,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                  },
                });

                Toast.fire({
                  icon: err.error.status > 400 ? 'error' : 'warning',
                  title: `${err.error.message}`,
                });
              }
            }
          );
      }
    });
  }

  // both forms data update
  subs_userAboutData!: Subscription;
  urlFormData!: socialMedia;
  aboutFormData!: aboutData;
  profileDataLoading: boolean = false;
  formData(urlForm: socialMedia | null, aboutForm: aboutData | null) {
    if (urlForm) this.urlFormData = urlForm;
    if (aboutForm) this.aboutFormData = aboutForm;
    if (this.urlFormData && this.aboutFormData) {
      this.profileDataLoading = true;
      this.subs_userAboutData = this._settingsService
        .updateUserData(this.urlFormData, this.aboutFormData)
        .subscribe(
          (res: apiRes) => {
            this.profileDataLoading = false;
            this.userData = res.data;
            // success alert
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              showCloseButton: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            Toast.fire({
              icon: 'success',
              title: `${res.message}`,
            });
          },
          (err) => {
            this.profileDataLoading = false;
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 4000,
              showCloseButton: true,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: err.error.status > 400 ? 'error' : 'warning',
              title: `${err.error.message}`,
            });
          }
        );
    }
  }

  // updating about form
  error!: string | null;
  submitAboutForm(aboutForm: NgForm): void {
    const name: any = aboutForm.controls['displayName'];
    let displayName: string = name.value;
    displayName = displayName.replace(/\s+/g, ' ').trim();
    if (aboutForm.invalid) {
      if (name.errors.required) {
        this.error = 'Name is required!';
      } else if (name.errors.minlength) {
        this.error = 'Name should have a minimum length of 4 characters!';
      }
    } else {
      if (displayName.length <= 3) {
        if (displayName.length == 0) {
          this.error = 'Name is required!';
        } else {
          this.error = 'Name should have a minimum length of 4 characters!';
        }
      } else {
        this.error = null;
        aboutForm.value.displayName = displayName;
        const aboutData = aboutForm.value;
        if (aboutData.location == undefined) {
          aboutData.location = null;
        }
        if (aboutData.bio == undefined) {
          aboutData.bio = null;
        }
        aboutData.location = aboutData.location.replace(/\s+/g, ' ').trim();
        aboutData.bio = aboutData.bio.replace(/\s+/g, ' ').trim();
        this.formData(null, aboutData);
      }
    }
  }

  // updating form form
  submitSocialForm(socialMedia: NgForm): void {
    if (!this.error) {
      const socialMediaData = socialMedia.value;
      if (socialMedia.value.linkedInUrl === undefined) {
        socialMedia.value.linkedInUrl = null;
      }
      if (socialMedia.value.twitterUrl === undefined) {
        socialMedia.value.twitterUrl = null;
      }
      socialMediaData.linkedInUrl = socialMediaData.linkedInUrl.replace(
        /\s/g,
        ''
      );
      socialMediaData.twitterUrl = socialMediaData.twitterUrl.replace(
        /\s/g,
        ''
      );
      this.formData(socialMediaData, null);
    }
  }

  clearError() {
    this.error = null;
  }

  // otp toggle
  otpToggle: boolean = false;

  ngOnDestroy(): void {
    this.subs_param?.unsubscribe();
    this.subs_ownerData?.unsubscribe();
    this.subs_userdata?.unsubscribe();
    this.subs_profileUpdate?.unsubscribe();
    this.subs_removeProfileimg?.unsubscribe();
    this.subs_userAboutData?.unsubscribe();
  }
}
