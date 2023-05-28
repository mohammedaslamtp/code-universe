import { Injectable, isDevMode } from '@angular/core';
import { User } from '../components/user/signup/newUser';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LOGIN } from '../components/user/login/userLogin';
import { Router } from '@angular/router';
import { coding, popupLog } from './shared-values.service';
import { Templates } from '../types/template_types';
import { USerData } from '../types/UserData';
// import { apiUrl } from '../../environments/environment.development';
// import { domain } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api_url = 'http://localhost:3000';
  intervalId: any;

  constructor(private http: HttpClient, private route: Router) {}

  // create a new account
  signup(newUser: User): Observable<User> {
    const url = `${this.api_url}/signup`;
    setTimeout(() => {
      this.tokenRefresh();
    }, 3000);
    return this.http.post(url, newUser, httpOptions);
  }

  // login to account
  login(login: LOGIN): Observable<LOGIN> {
    const url = `${this.api_url}/login`;
    setTimeout(() => {
      this.tokenRefresh();
    }, 3000);
    return this.http.post(url, login, httpOptions);
  }

  // fetch user data
  getUserData(): Observable<USerData> {
    const url = `${this.api_url}/getUserData`;
    return this.http.get<USerData>(url, httpOptions);
  }

  // generate OTP for verification
  genreateOtp(): Observable<any> {
    const url = `${this.api_url}/generateOtp`;
    return this.http.get(url, httpOptions);
  }

  // verify your OTP
  verifyOtp(otp: number | string): Observable<any> {
    const url = `${this.api_url}/verifyOtp`;
    return this.http.post(url, { otp: otp }, httpOptions);
  }

  // otp verification alert close
  otpAlertClose() {
    let alert: any = document.getElementById('otp_alert');
    alert.style.display = 'none';
  }

  // refreshing token
  tokenRefresh() {
    this.intervalId = setInterval(() => {
      this.generateToken(localStorage.getItem('refresh_token')).subscribe(
        (token) => {
          if (token) {
            console.log('refresh token: ', token);
            localStorage.setItem('token', token);
            console.log('refresh after set: ', localStorage.getItem('token'));
          }
        }
      );
    }, 600000);
  }

  initialUse() {
    this.generateToken(localStorage.getItem('refresh_token')).subscribe(
      (token) => {
        if (token) {
          console.log('token: ', token);
          localStorage.setItem('token', token);
          console.log('after set: ', localStorage.getItem('token'));
        }
      }
    );
  }

  check() {
    if (localStorage.getItem('refresh_token')) {
      this.tokenRefresh();
    } else {
      this.clearInterval();
    }
  }

  clearInterval() {
    clearInterval(this.intervalId);
  }

  // generate new access token
  generateToken(token: string | null): Observable<any> {
    const url = `${this.api_url}/generateToken?token=${token}`;
    return this.http.get(url, httpOptions);
  }

  // token storing in local storage
  storeToken(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  // to cheking logged in or not
  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // get template for home page:
  getTemplates(): Observable<Templates> {
    const url = `${this.api_url}/getTemplates`;
    return this.http.get<Templates>(url, httpOptions);
  }

  // logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    coding.next(false);
    this.otpAlertClose();
    clearInterval(this.intervalId);
    this.route.navigate(['/']);
  }

  // running code
  runCode(
    html: any,
    css: any,
    js: any,
    title: any,
    random: any
  ): Observable<any> {
    let id: null | string = 'guest-user';
    if (this.loggedIn()) {
      id = localStorage.getItem('token');
    } else {
      id = 'guest-user';
    }

    if (html == undefined || html == null || typeof html != 'string') {
      html = '';
    }
    if (css == undefined || css == null || typeof css != 'string') {
      css = '';
    }
    if (js == undefined || js == null || typeof js != 'string') {
      js = '';
    }
    const url = `${this.api_url}/saveCode`;
    return this.http.put(
      url,
      {
        title: title,
        html: html,
        css: css,
        js: js,
        user_id: id,
        random: random,
      },
      httpOptions
    );
  }

  isPopupLog(): boolean {
    let res = false;
    popupLog.subscribe((value) => {
      res = value;
    });
    return res;
  }

  // reload iframe
  reloadIframe(id: string): Observable<any> {
    const url = `${this.api_url}/codeRun?id=${id}`;
    return this.http.get(url, {
      responseType: 'text',
    });
  }

  // save code
  saveCode(
    title: any,
    html: any,
    css: any,
    js: any,
    random: string
  ): Observable<any> {
    const url = `${this.api_url}/storeCode`;
    this.runCode;
    return this.http.put(
      url,
      { title: title, html: html, css: css, js: js, random: random },
      httpOptions
    );
  }

  // remove unwanted codes from database
  removeCode(random: string): Observable<any> {
    const url = `${this.api_url}/removeCode?random=${random}`;
    return this.http.delete(url, httpOptions);
  }
}
