import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { OTP } from './types/OTP';
import { Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  error$?: Observable<string> | string;
  data$?: Observable<OTP>;
  constructor(private _userService: UserService, private _router: Router) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this._userService.loggedIn()) {
          this._userService.initialUse();
        }
      }
    });
  }

  ngOnInit(): void {
    this._userService.check();
  }
}
