import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class MainService {
  private _apiUrl = 'http://localhost:3000';
  constructor() {}

  // signup(newUser: User): Observable<User> {
  //   const url = `${this.api_url}/signup`;
  //   return this.http.post(url, newUser, httpOptions);
  // }
}
