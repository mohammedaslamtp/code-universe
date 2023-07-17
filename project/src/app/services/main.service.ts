import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Template } from '../types/template_types';
import { Observable } from 'rxjs';
import { USerData } from '../types/UserData';
import { domain } from './shared-values.service';
import { apiRes } from '../types/defulatApiRes';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class MainService {
  private readonly _apiUrl = domain;
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

  getTemplateDetail(id: string): Observable<apiRes> {
    let url = `${this._apiUrl}/getUserData`;
    url = `${this._apiUrl}/getTemplateDetail?id=${id}`;
    return this._http.get<apiRes>(url, httpOptions);
  }

  getEditorDetail(id: string): Observable<apiRes> {
    let url = `${this._apiUrl}/getUserData`;
    url = `${this._apiUrl}/getEditorOptions?id=${id}`;
    return this._http.get<apiRes>(url, httpOptions);
  }
}
