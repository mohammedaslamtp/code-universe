import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Template } from '../types/template_types';
import { Observable } from 'rxjs';
import { USerData } from '../types/UserData';

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
  constructor(private _http: HttpClient) {}

  // searching codes
  search(q: string): Observable<Template> {
    const url = `${this._apiUrl}/searchCode?q=${q}`;
    return this._http.get<Template>(url, httpOptions);
  }

  getUserData(id: string): Observable<USerData> {
    let url = `${this._apiUrl}/getUserData`;
    if (id) {
      url = `${this._apiUrl}/getUserData?id=${id}`;
    }
    return this._http.get<USerData>(url, httpOptions);
  }
}
