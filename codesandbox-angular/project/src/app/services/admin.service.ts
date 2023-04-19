import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

interface login {
  email ?: string | boolean | null;
  password ?: string | boolean | null;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private api_url = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) { }
  
  login(data:login): Observable<login>{
    console.log('data: ',data);
    const url = `${this.api_url}/login`;
    return this.http.post(url, data, httpOptions);
  }

}
