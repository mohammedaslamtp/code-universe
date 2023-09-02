import { Injectable } from '@angular/core';
import { User } from '../components/user/signup/newUser';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LOGIN } from '../components/user/login/userLogin';
import { Router } from '@angular/router';
import { coding, domain, popupLog } from './shared-values.service';
import { Template, Templates } from '../types/template_types';
import { USerData } from '../types/UserData';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable()
export class UserService {
  private readonly api_url = domain;
  intervalId: any;

  constructor(private _http: HttpClient, private _route: Router) {}

  // create a new account
  signup(newUser: User): Observable<User> {
    const url = `${this.api_url}/signup`;
    setTimeout(() => {
      this.tokenRefresh();
    }, 3000);
    return this._http.post(url, newUser, httpOptions);
  }

  // login to account
  login(login: LOGIN): Observable<LOGIN> {
    const url = `${this.api_url}/login`;
    setTimeout(() => {
      this.tokenRefresh();
    }, 3000);
    return this._http.post(url, login, httpOptions);
  }

  // fetch user data
  getUserData(str?: string): Observable<USerData> {
    let url = `${this.api_url}/getUserData`;
    str = str?.trim();
    if (str != '' && str != undefined && str != null) {
      url = `${this.api_url}/getUserData?name=${str}`;
    }
    return this._http.get<USerData>(url, httpOptions);
  }

  // generate OTP for verification
  genreateOtp(): Observable<any> {
    const url = `${this.api_url}/generateOtp`;
    return this._http.get(url, httpOptions);
  }

  // verify your OTP
  verifyOtp(otp: number | string): Observable<any> {
    const url = `${this.api_url}/verifyOtp`;
    return this._http.post(url, { otp: otp }, httpOptions);
  }

  // otp verification alert close
  otpAlertClose() {
    let alert: any = document.getElementById('otp_alert');
    if (alert.style) alert.style.display = 'none';
  }

  // refreshing token
  tokenRefresh() {
    this.intervalId = setInterval(() => {
      this.generateToken(localStorage.getItem('refresh_token')).subscribe(
        (token) => {
          if (token) {
            localStorage.setItem('token', token);
          }
        }
      );
    }, 600000);
  }

  initialUse() {
    this.generateToken(localStorage.getItem('refresh_token')).subscribe(
      (token) => {
        if (token) {
          localStorage.setItem('token', token);
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
    return this._http.get(url, httpOptions);
  }

  // token storing in local storage
  storeToken(accessToken: string, refreshToken: string) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  // to cheking logged in or not
  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // get template for home page:
  getTemplates(): Observable<Templates> {
    const url = `${this.api_url}/getTemplates`;
    return this._http.get<Templates>(url, httpOptions);
  }

  // logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    coding.next(false);
    clearInterval(this.intervalId);
    this._route.navigate(['/']);
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
    return this._http.put(
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
    return this._http.get(url, {
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
    return this._http.put(
      url,
      { title: title, html: html, css: css, js: js, random: random },
      httpOptions
    );
  }

  // remove unwanted codes from database
  removeCode(random: string): Observable<any> {
    const url = `${this.api_url}/removeCode?random=${random}`;
    return this._http.delete(url, httpOptions);
  }

  // get private templates
  getPrivateCodes(id: string): Observable<Templates> {
    const url = `${this.api_url}/getPrivateCodes?id=${id}`;
    return this._http.get<Templates>(url, httpOptions);
  }

  // get public templates
  getPublicCodes(id: string): Observable<Templates> {
    const url = `${this.api_url}/getPublicCodes?id=${id}`;
    return this._http.get<Templates>(url, httpOptions);
  }

  // make it private
  privateCode(id: string): Observable<boolean> {
    const url = `${this.api_url}/makeItPrivate?id=${id}`;
    return this._http.patch<boolean>(url, httpOptions);
  }

  // make it private
  publicCode(id: string): Observable<boolean> {
    const url = `${this.api_url}/makeItPublic?id=${id}`;
    return this._http.patch<boolean>(url, httpOptions);
  }

  // delete templates
  deleteCode(id: string): Observable<boolean> {
    const url = `${this.api_url}/deleteCode?id=${id}`;
    return this._http.delete<boolean>(url, httpOptions);
  }

  isValidLive(query: string): Observable<boolean> {
    const url = `${this.api_url}/isValidLive?roomId=${query}`;
    return this._http.get<boolean>(url, httpOptions);
  }

  // store live code
  storeLiveCode(
    roomId: string,
    html: string,
    css: string,
    js: string
  ): Observable<any> {
    const url = `${this.api_url}/storeLiveCode`;
    return this._http.post(
      url,
      { room: roomId, html: html, css: css, js: js },
      httpOptions
    );
  }

  // run live code
  runLiveCode(roomId: string): Observable<any> {
    const url = `${this.api_url}/runLiveCode?room=${roomId}`;
    return this._http.get(url, {
      responseType: 'text',
    });
  }

  saveLiveCode(html: string, css: string, js: string): Observable<Template> {
    const url = `${this.api_url}/saveLiveCode`;
    return this._http.post<Template>(
      url,
      { html: html, css: css, js: js },
      httpOptions
    );
  }
  
  // to remove un-neccessary codes from database
  removeLive(id: string) {
    const url = `${this.api_url}/removeLive?id=${id}`;
    return this._http.delete(url, httpOptions);
  }

  updateLiveCode(
    id: string,
    html: string,
    css: string,
    js: string
  ): Observable<Template> {
    const url = `${this.api_url}/updateLiveCode`;
    return this._http.patch<Template>(
      url,
      { html: html, css: css, js: js, id: id },
      httpOptions
    );
  }
}
