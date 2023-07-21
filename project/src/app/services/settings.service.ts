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
    urlForm: socialMedia | null,
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

  // change editor theme
  chageTheme(theme: string): Observable<apiRes> {
    const url = `${this._apiUrl}/changeEditorTheme`;
    return this._http.patch<apiRes>(url, { theme: theme }, httpOptions);
  }

  // change font size
  chageFontSize(fontSize: number): Observable<apiRes> {
    const url = `${this._apiUrl}/changeFontSize`;
    return this._http.patch<apiRes>(url, { fontSize: fontSize }, httpOptions);
  }

  // change tab size
  chageTabSize(tabSize: number): Observable<apiRes> {
    const url = `${this._apiUrl}/changeTabSize`;
    return this._http.patch<apiRes>(url, { tabSize: tabSize }, httpOptions);
  }

  // adjust line number option
  lineNumber(lineNumber: boolean): Observable<apiRes> {
    const url = `${this._apiUrl}/adjustLineNumber`;
    return this._http.patch<apiRes>(
      url,
      { lineNumber: lineNumber },
      httpOptions
    );
  }

  // adjust line wrapping option
  lineWrapping(LineWrapping: boolean): Observable<apiRes> {
    const url = `${this._apiUrl}/adjustLineWrapping`;
    return this._http.patch<apiRes>(
      url,
      { LineWrapping: LineWrapping },
      httpOptions
    );
  }

  // adjust editor suggestions
  editorSuggestions(suggestion: boolean): Observable<apiRes> {
    const url = `${this._apiUrl}/editorSuggestions`;
    return this._http.patch<apiRes>(
      url,
      { suggestion: suggestion },
      httpOptions
    );
  }

  // adjust code formating when saving
  formatOnSave(formatOnSave: boolean): Observable<apiRes> {
    const url = `${this._apiUrl}/formatOnSave`;
    return this._http.patch<apiRes>(
      url,
      { formatOnSave: formatOnSave },
      httpOptions
    );
  }
}
