import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USerData } from '../types/UserData';
import { domain } from './shared-values.service';
import { apiRes } from '../types/defulatApiRes';

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

  // to get all comments
  giveComments(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/allComments?id=${id}`;
    return this._http.get<apiRes>(url, httpOptions);
  }

  // get liked users of a particular template
  getLikedUsers(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/likedUsers?id=${id}`;
    return this._http.get<apiRes>(url, httpOptions);
  }

  // add to pin
  addToPin(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/addToPin`;
    return this._http.post<apiRes>(url, { id: id }, httpOptions);
  }

  // remove from pin list
  removeFromPin(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/removeFromPin?id=${id}`;
    return this._http.patch<apiRes>(url, httpOptions);
  }

  // get all following users
  getAllFollowingUsers(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/getAllFollowingUsers?id=${id}`;
    return this._http.get<apiRes>(url, httpOptions);
  }

  // get all followed users
  getAllFollowers(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/getAllFollowers?id=${id}`;
    return this._http.get<apiRes>(url, httpOptions);
  }

  // up vote
  upVote(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/upVote?id=${id}`;
    return this._http.patch<apiRes>(url, httpOptions);
  }
  // down vote
  downVote(id: string): Observable<apiRes> {
    const url = `${this._apiUrl}/downVote?id=${id}`;
    return this._http.patch<apiRes>(url, httpOptions);
  }
}
