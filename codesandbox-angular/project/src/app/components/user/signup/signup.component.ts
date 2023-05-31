import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Registration } from '../../../stores/actions/signupAction';
import { reg_errorSelector } from 'src/app/stores/selector';
import { appStateInterface } from 'src/app/types/appState';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  error_reason$?: Observable<string> | string;
  constructor(private store: Store<appStateInterface>) {
    this.store.pipe(select(reg_errorSelector)).subscribe((err: any) => {
      this.error_reason$ = err;
    });
  }

  signup = new FormGroup({
    fullName: new FormControl(null),
    email: new FormControl(null),
    phone: new FormControl(null),
    new_password: new FormControl(null),
    c_password: new FormControl(null),
  });

  onSubmit() {
    this.store.dispatch(Registration({ register: this.signup.value }));
  }

  close_alert() {
    let alert: any = document.getElementById('alert');
    this.error_reason$ = '';
    alert.style.visibility = 'hidden';
  }
}
