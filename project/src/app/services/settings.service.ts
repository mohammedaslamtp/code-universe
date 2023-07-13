import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { domain } from './shared-values.service';
import { apiRes } from '../types/defulatApiRes';
import { aboutData, socialMedia } from '../types/profileForms';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable()
export class SettingsService {
  private readonly _apiUrl: string = domain;
  constructor(private _http: HttpClient) {}

  // profile image updation
  profileUpdate(file: File): Observable<apiRes> {
    const formData: FormData = new FormData();
    const url = `${this._apiUrl}/upload`;
    formData.append('avatar', file);
    return this._http.post<apiRes>(url, formData);
  }

  // remove profile image
  removeProfileImage(): Observable<apiRes> {
    const url = `${this._apiUrl}/removeProfile`;
    return this._http.patch<apiRes>(url, httpOptions);
  }

  // update user about data
  updateUserData(
    urlForm: socialMedia,
    aboutForm: aboutData
  ): Observable<apiRes> {
    const url = `${this._apiUrl}/updateAbout`;
    return this._http.patch<apiRes>(
      url,
      { urlData: urlForm, aboutData: aboutForm },
      httpOptions
    );
  }

  // checking username uniqueness
  isUsernameUnique(username: string): Observable<apiRes> {
    const url = `${this._apiUrl}/isUsernameUnique?username=${username}`;
    return this._http.get<apiRes>(url, httpOptions);
  }

  // change username
  changeUsername(username: string): Observable<apiRes> {
    const url = `${this._apiUrl}/changeUsername?username=${username}`;
    return this._http.patch<apiRes>(url, httpOptions);
  }

  // change password
  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<apiRes> {
    const url = `${this._apiUrl}/changePassword`;
    return this._http.patch<apiRes>(
      url,
      { cPassword: currentPassword, nPassword: newPassword },
      httpOptions
    );
  }
}
