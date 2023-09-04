import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { appStateInterface } from 'src/app/types/appState';
import { LoginData } from '../../../stores/actions/loginAction';
import {
  log_dataSelector,
  log_errorSelector,
  log_loadingSelector,
} from 'src/app/stores/selector';
import { LOGIN } from './userLogin';
import { popupLog } from 'src/app/services/shared-values.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  alert_msg?: Observable<string> | string;
  data$?: Observable<LOGIN>;
  loading$?: Observable<boolean>;

  constructor(private store: Store<appStateInterface>) {
    this.data$ = this.store.pipe(
      select(log_dataSelector),
      map((doc: any) => (this.data$ = doc))
    );
    this.data$?.subscribe((doc: LOGIN) => doc);

    this.alert_msg = this.store.pipe(
      select(log_errorSelector),
      map((doc: any) => (this.alert_msg = doc))
    );
    this.alert_msg?.subscribe((doc) => doc);

    this.loading$ = this.store.pipe(
      select(log_loadingSelector),
      map((doc: any) => (this.loading$ = doc))
    );
    this.loading$?.subscribe((doc) => doc);
  }

  ngOnInit(): void {}

  login = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null),
  });

  onSubmit() {
    try {
      console.log('data: ',this.login);
      popupLog.next(false);
      this.store.dispatch(LoginData({ login: this.login.value }));
    } catch (error) {
      console.log(error);
      
    }
  }

  close_alert() {
    let alert: any = document.getElementById('alert');
    this.alert_msg = '';
    alert.style.visibility = 'hidden';
  }
}
