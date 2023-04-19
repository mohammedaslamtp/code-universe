import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Registration } from '../../../stores/actions/signupAction';
import { reg_errorSelector } from 'src/app/stores/selector';
import { appStateInterface } from 'src/app/types/appState';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  error_reason$?: Observable<string> | string;
  constructor(private store: Store<appStateInterface>) {
    this.store.pipe(select(reg_errorSelector)).subscribe((err: any) => {
      this.error_reason$ = err;
      console.log(err);
    });
  }

  ngOnInit(): void {}

  signup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl(null),
    phone: new FormControl(null),
    new_password: new FormControl(null),
    c_password: new FormControl(null),
  });

  onSubmit() {
    console.log('signup data: ',this.signup.value)
    this.store.dispatch(Registration({ register: this.signup.value }));
  }

  close_alert() {
    let alert: any = document.getElementById('alert');
    this.error_reason$ = '';
    alert.style.visibility = 'hidden';
  }
}
