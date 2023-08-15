import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CodesForDownload } from '../types/downloadCode';
import { domain } from './shared-values.service';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};


@Injectable()
export class DownloadService {
  private readonly _apiUrl = domain;
  constructor(private _http: HttpClient) {}
  getCodes(templateId: string): Observable<CodesForDownload> {
    console.log('template id: ',templateId)
    const url = `${this._apiUrl}/codeForDownload?templateId=${templateId}`;
    return this._http.get<CodesForDownload>(url, httpOptions);
  }
}
