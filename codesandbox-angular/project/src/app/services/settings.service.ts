import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { domain } from './shared-values.service';
import { apiRes } from '../types/defulatApiRes';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable()
export class SettingsService {
  private _apiUrl: string = domain;
  constructor(private _http: HttpClient) {}

  // profile image updation
  profileUpdate(file: File): Observable<apiRes> {
    const formData: FormData = new FormData();
    const url = `${this._apiUrl}/upload`;
    formData.append('avatar', file);
    return this._http.post<apiRes>(url, formData);
  }
}
