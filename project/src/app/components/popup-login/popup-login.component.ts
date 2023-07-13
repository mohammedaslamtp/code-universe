import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { log_dataSelector, log_errorSelector } from 'src/app/stores/selector';
import { appStateInterface } from 'src/app/types/appState';
import { LOGIN } from '../user/login/userLogin';
import { LoginData } from 'src/app/stores/actions/loginAction';

import { logModToggle, popupLog } from 'src/app/services/shared-values.service';

@Component({
  selector: 'app-popup-login',
  templateUrl: './popup-login.component.html',
  styleUrls: ['./popup-login.component.css'],
})
export class PopupLoginComponent implements OnInit {
  toggle: boolean = true;
  data$?: Observable<LOGIN>;
  constructor(private store: Store<appStateInterface>) {
    this.alert_msg = this.store.pipe(
      select(log_errorSelector),
      map((doc: any) => (this.alert_msg = doc))
    );
    this.alert_msg?.subscribe((doc) => doc);

    this.data$ = this.store.pipe(
      select(log_dataSelector),
      map((doc: any) => {
        this.data$ = doc;
        return doc;
      })
    );
    this.data$?.subscribe((doc: LOGIN) => {
      let bg: any = document.getElementById('background_overlay');
      if (bg.style) bg.style.display = 'none';
      this.closeModal()
      return doc;
    });
  }

  alert_msg?: Observable<string> | string;
  
  // login data
  login = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null),
  });

  // login user
  loginSubmit() {
    popupLog.next(true);
    this.store.dispatch(LoginData({ login: this.login.value }));
  }

  // closing alert msg
  close_alert() {
    let alert: any = document.getElementById('alert');
    this.alert_msg = '';
    alert.style.visibility = 'hidden';
  }

  // close toggle
  closeModal() {
    this.toggle = false;
  }

  ngOnInit(): void {
    logModToggle.subscribe((value) => {
      this.toggle = value;
      if (this.toggle) {
        let bg: any = document.getElementById('background_overlay');
        bg.style.display = 'block';
      }
    });
  }

  // overlay disable
  backgroundNone(): void {
    let bg: any = document.getElementById('background_overlay');
    bg.style.display = 'none';
  }
}
