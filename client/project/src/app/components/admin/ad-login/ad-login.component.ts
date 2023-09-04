import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { ad_LoginData } from 'admin_store/actions/admin_login';
import { adminAppState } from 'admin_store/admin_types/adminApp';
import { adminLoginError } from 'admin_store/selectors';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ad-login',
  templateUrl: './ad-login.component.html',
  styleUrls: ['./ad-login.component.css'],
})
export class AdLoginComponent {
  error$?: Observable<string> | string;
  constructor(private store: Store<adminAppState>) {
    this.store.pipe(select(adminLoginError)).subscribe((err: any) => {
      this.error$ = err;
    });
  }

  ad_login = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null),
  });

  onSubmit() {
    this.store.dispatch(ad_LoginData({ admin_login: this.ad_login.value }));
  }

  error_clear() {
    this.error$ = '';
    const msg: any = document.getElementById('alert-msg');
    msg.style.visibility = 'hidden';
  }
}
