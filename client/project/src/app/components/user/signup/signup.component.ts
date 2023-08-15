import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Registration } from '../../../stores/actions/signupAction';
import {
  reg_errorSelector,
  reg_loadingSelector,
} from 'src/app/stores/selector';
import { appStateInterface } from 'src/app/types/appState';
import { User } from './newUser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  error_reason$?: Observable<string> | string;
  loading$?: Observable<boolean>;
  userData!: User;
  constructor(private store: Store<appStateInterface>) {
    this.store.pipe(select(reg_errorSelector)).subscribe((err: any) => {
      this.error_reason$ = err;
    });
    this.store.pipe(select(reg_loadingSelector)).subscribe((load: any) => {
      this.loading$ = load;
    });
  }

  signup = new FormGroup({
    fullName: new FormControl(null),
    email: new FormControl(null),
    new_password: new FormControl(null),
    c_password: new FormControl(null),
  });

  onSubmit() {
    if (this.signup.value.fullName) {
      let fullName: string = this.signup.value.fullName;
      fullName = fullName.trim();
      this.userData = this.signup.value;
      this.userData.fullName = fullName;
      if (fullName != '') {
        this.store.dispatch(Registration({ register: this.userData }));
      } else {
        this.error_reason$ = 'Full Name must be charecters!';
      }
    }
  }

  close_alert() {
    let alert: any = document.getElementById('alert');
    this.error_reason$ = '';
    alert.style.visibility = 'hidden';
  }
}
