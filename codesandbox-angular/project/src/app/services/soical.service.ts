import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USerData } from '../types/UserData';
import { domain } from './shared-values.service';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable()
export class SocialService {
  api_url: string = domain;

  constructor(private _http: HttpClient) {}

  // for follow user
  follow(id: string): Observable<USerData> {
    const url = `${this.api_url}/following?id=${id}`;
    return this._http.patch<USerData>(url, httpOptions);
  }

  // for unfollow user
  unFollow(id: string): Observable<USerData> {
    const url = `${this.api_url}/unFollowing?id=${id}`;
    return this._http.patch<USerData>(url, httpOptions);
  }
}
