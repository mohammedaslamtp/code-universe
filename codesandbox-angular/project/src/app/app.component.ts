import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { Store } from '@ngrx/store';
import { OTP } from './types/OTP';
import { Observable } from 'rxjs';
import { appStateInterface } from './types/appState';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  error$?: Observable<string> | string;
  data$?: Observable<OTP>;
  constructor(
    private userService: UserService,
    private store: Store<appStateInterface>,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.userService.loggedIn()) {
          this.userService.initialUse();
        }
      }
    });

    // this.userService.tokenRefresh()
    // this.userService.check();
    // if (this.userService.loggedIn()) {
    //   // error
    //   this.error$ = this.store.pipe(
    //     select(otp_errorSelector),
    //     map((err: any) => (this.error$ = err))
    //   );
    //   this.error$?.subscribe((err: any) => {
    //     console.log('otp generate error', err);
    //     return err;
    //   });

    //   this.data$ = this.store.pipe(
    //     select(otp_dataSelector),
    //     map((doc: any) => (this.data$ = doc))
    //   );
    //   this.data$?.subscribe((doc: OTP) => doc);
    // }
  }

  ngOnInit(): void {
    this.userService.check();
  }
}
