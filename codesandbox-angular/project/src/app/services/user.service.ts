import { Injectable } from '@angular/core';
import { User } from '../components/user/signup/newUser';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LOGIN } from '../components/user/login/userLogin';
import { Router } from '@angular/router';

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

  signup(newUser: User): Observable<User> {
    console.log('new user: ', newUser);
    const url = `${this.api_url}/signup`;
    setTimeout(() => {
      this.tokenRefresh();
    }, 3000);
    return this.http.post(url, newUser, httpOptions);
  }

  login(login: LOGIN): Observable<LOGIN> {
    console.log('login data: ', login);
    const url = `${this.api_url}/login`;
    setTimeout(() => {
      console.log('timeout working...');
      this.tokenRefresh();
    }, 3000);
    return this.http.post(url, login, httpOptions);
  }

  tokenRefresh() {
    this.intervalId = setInterval(() => {
      this.generateToken(localStorage.getItem('refresh_token')).subscribe(
        (token) => {
          console.log('new token', token);
          if (token) {
            localStorage.setItem('token', token);
          }
        }
      );
    }, 900000);
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

  generateToken(token: string | null): Observable<any> {
    console.log('generate token is working...');
    const url = `${this.api_url}/generateToken?token=${token}`;
    return this.http.get(url, httpOptions);
  }

  storeToken(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    console.log('clearing interval...');
    clearInterval(this.intervalId);
    this.route.navigate(['/']);
  }

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

    console.log('html: ', html);
    console.log('css: ', css);
    console.log('js: ', js);
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

  // reload iframe
  reloadIframe(id: string): Observable<any> {
    console.log('id ', id);
    const url = `${this.api_url}/codeRun?id=${id}`;
    return this.http.get(url, {
      responseType: 'text',
    });
  }
}
