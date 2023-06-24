import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _router: Router, private _userService: UserService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('/admin')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
    } else {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    }
    return next.handle(req).pipe(
      catchError((e: HttpErrorResponse) => {
        console.log('interceptor error: ', e);
        if (e.status == 401) {
          console.log();
          // this._userService.logout();
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          this._router.navigate(['/']);
        }
        return throwError(e);
      })
    );
  }
}
