import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  }

  ngOnInit(): void {
    this.userService.check();
  }

  @ViewChild('searchQ') searchField!: ElementRef;
  focusSearch(event: KeyboardEvent) {
    console.log('app event working...');
    let key = event.key;
    // const searchFeild = document.querySelector('.searching_field');
    if (key == '/') {
      console.log('/ clicked');
      // searchFeild?.focus();
      this.searchField.nativeElement.focus();
    }
  }
}
