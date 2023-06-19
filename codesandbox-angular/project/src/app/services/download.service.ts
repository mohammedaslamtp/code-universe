import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CodesForDownload } from '../types/downloadCode';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};


@Injectable()
export class DownloadService {
  private _apiUrl = 'http://localhost:3000';
  constructor(private _http: HttpClient) {}
  getCodes(templateId: string): Observable<CodesForDownload> {
    const url = `${this._apiUrl}/codeForDownload?templateId=${templateId}`;
    return this._http.get<CodesForDownload>(url, httpOptions);
  }
}
