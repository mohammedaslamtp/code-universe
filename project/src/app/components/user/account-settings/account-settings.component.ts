import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
})
export class AccountSettingsComponent implements OnDestroy {
  userData!: USerData;
  subs_userData: Subscription;
  usernameError: string | null = null;

  constructor(
    private _userService: UserService,
    private _settingsService: SettingsService,
    private _router: Router
  ) {
    this.subs_userData = this._userService.getUserData().subscribe(
      (data) => {
        this.userData = data;
      },
      (err) => {
        this._router.navigate(['**']);
      }
    );
  }

  @ViewChild('usernameField') usernameField!: ElementRef;
  // validating username
  subs_usernameUniqueness!: Subscription;
  validateUsername(usernameForm: NgForm) {
    const username: any = usernameForm.controls['username'];
    if (usernameForm.invalid) {
      if (username.errors.required) {
        this.usernameError = 'Username is required!';
        this.usernameField.nativeElement.focus();
      } else if (username.errors.minlength) {
        this.usernameError = `Username should have a minimum length of ${username.errors.minlength.requiredLength} characters!`;
        this.usernameField.nativeElement.focus();
      } else if (username.errors.pattern) {
        this.usernameError = 'Username should not contain spaces!';
        this.usernameField.nativeElement.focus();
      }
    } else {
      this.subs_usernameUniqueness = this._settingsService
        .isUsernameUnique(usernameForm.value.username)
        .subscribe(
          (val) => {
            if (val.data.unique == false) {
              this.usernameError = val.message;
            } else {
              this.usernameError = null;
            }
          },
          (e) => this.errorSwal(e.error.status, e.error.message)
        );
    }
  }

  // changing username
  changeUsernameLoading: boolean = false;
  subs_changeUsername!: Subscription;
  changeUsername(usernameForm: NgForm) {
    this.changeUsernameLoading = true;
    this.subs_usernameUniqueness = this._settingsService
      .isUsernameUnique(usernameForm.value.username)
      .subscribe(
        (val) => {
          if (val.data.unique == false) {
            this.changeUsernameLoading = false;
            this.usernameError = val.message;
          } else {
            this.changeUsernameLoading = false;
            this.usernameError = null;
            this.subs_changeUsername = this._settingsService
              .changeUsername(usernameForm.value.username)
              .subscribe(
                (val) => {
                  if (val.data.username) {
                    this.userData.full_name = val.data.username;
                    this.successSwal(val.message);
                  }
                },
                (err) => this.errorSwal(err.error.status, err.error.message)
              );
          }
        },
        (e) => this.errorSwal(e.error.status, e.error.message)
      );
  }

  // clear error messages
  clearUsernameError = () => (this.usernameError = null);
  clearCurrPasswordError = () => (this.currentPasswordError = null);
  clearNewPasswordError = () => (this.newPasswordError = null);

  // change password
  changePaswordLoading: boolean = false;
  currentPasswordError: string | null = null;
  newPasswordError: string | null = null;
  subs_changePassword!: Subscription;
  changePassword(passwrordForm: NgForm) {
    this.changePaswordLoading = true;
    const current_password: any = passwrordForm.controls['currentPassword'];
    const new_password: any = passwrordForm.controls['newPassword'];
    if (passwrordForm.invalid) {
      if (current_password.errors && current_password.errors.required) {
        this.changePaswordLoading = false;
        this.currentPasswordError = 'Current password is required';
      }
      if (new_password.errors && new_password.errors.required) {
        this.changePaswordLoading = false;
        this.newPasswordError = 'New password is required!';
      } else if (new_password.errors && new_password.errors?.minlength) {
        this.changePaswordLoading = false;
        this.newPasswordError = `New password should have a minimum length of ${new_password.errors.minlength.requiredLength} characters!`;
      }
    } else {
      this.subs_changePassword = this._settingsService
        .changePassword(
          passwrordForm.value.currentPassword,
          passwrordForm.value.newPassword
        )
        .subscribe(
          (val) => {
            if (val.data.isCorrect) {
              this.changePaswordLoading = false;
              this.clearCurrPasswordError();
              this.clearNewPasswordError();
              this.successSwal(val.message);
            } else {
              this.changePaswordLoading = false;
              this.currentPasswordError = val.message;
            }
          },
          (err) => {
            this.changePaswordLoading = false;
            this.errorSwal(err.error.status, err.error.message);
          }
        );
    }
  }

  // success swal alert
  successSwal(message: string) {
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
      title: `${message}`,
    });
  }

  // error swal alert
  errorSwal(status: number, message: string) {
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
      icon: status > 400 ? 'error' : 'warning',
      title: `${message}`,
    });
  }

  ngOnDestroy(): void {
    this.subs_userData?.unsubscribe();
    this.subs_usernameUniqueness?.unsubscribe();
    this.subs_changeUsername?.unsubscribe();
    this.subs_changePassword?.unsubscribe();

    this.clearUsernameError();
    this.clearCurrPasswordError();
    this.clearNewPasswordError();
  }
}
