import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ad_login } from '../components/admin/ad-login/adminLogin';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class AdminService {
  private api_url = 'http://localhost:3000/admin';

  constructor(private http: HttpClient, private route: Router) {}

  login(data: ad_login): Observable<ad_login> {
    const url = `${this.api_url}/login`;
    return this.http.post(url, data, httpOptions);
  }

  admin_logout() {
    localStorage.removeItem('admin_token');
    this.route.navigate(['/admin/login']);
  }

  hasAdmin(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  getUsersData() {
    const url = `${this.api_url}/getUsers`;
    return this.http.get(url, httpOptions);
  }

  blockUser(id: string) {
    const url = `${this.api_url}/blockUser`;
    return this.http.patch(url, { user_id: id }, httpOptions);
  }

  unblockUser(id: string) {
    const url = `${this.api_url}/unblockUser`;
    return this.http.patch(url, { user_id: id }, httpOptions);
  }
}
