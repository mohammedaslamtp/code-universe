import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USerData } from '../types/UserData';
import { domain } from './shared-values.service';
import { apiRes } from '../types/defulatApiRes';
import { comment } from '../types/comment';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable()
export class SocialService {
  private readonly _apiUrl: string = domain;

  constructor(private _http: HttpClient) {}

  // for follow user
  follow(id: string): Observable<USerData> {
    const url = `${this._apiUrl}/following?id=${id}`;
    return this._http.patch<USerData>(url, httpOptions);
  }

  // for unfollow user
  unFollow(id: string): Observable<USerData> {
    const url = `${this._apiUrl}/unFollowing?id=${id}`;
    return this._http.patch<USerData>(url, httpOptions);
  }

  // for giving like to template
  giveLike(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/like?id=${id}`;
    return this._http.patch<apiRes>(url, httpOptions);
  }

  // for returning like from template
  returnLike(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/disLike?id=${id}`;
    return this._http.patch<apiRes>(url, httpOptions);
  }
}
