import { Injectable } from '@angular/core';
import { User } from '../components/user/signup/newUser';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LOGIN } from '../components/user/login/userLogin';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api_url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  signup(newUser: User): Observable<User> {
    console.log('new user: ', newUser);
    const url = `${this.api_url}/signup`;
    return this.http.post(url, newUser, httpOptions);
  }

  login(login: LOGIN): Observable<LOGIN> {  
    console.log('login data: ', login);
    const url = `${this.api_url}/login`;
    return this.http.post(url, login, httpOptions);
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
