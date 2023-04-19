import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
  
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('intercept working...');
    if (localStorage.getItem('token')) {
    } else {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    }
    return next.handle(req);
  }
}
