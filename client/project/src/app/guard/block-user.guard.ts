import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class BlockUserGuard implements CanActivate {
  is_blocked!: boolean;
  constructor(private _route: Router, private _userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._userService.getUserData().pipe(
      map((data) => {
        this.is_blocked = data.is_spam;
        if (this.is_blocked == false) {
          return true;
        } else {
          // showing alert message for blocked
          let timerInterval: any = Swal.fire({
            title: 'You are blocked!',
            html: 'You will redirect within <b></b> milliseconds.',
            timer: 4000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const b: any = Swal.getHtmlContainer()?.querySelector('b');
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft();
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              this._route.navigate(['/login']);
            }
          });
          return false;
        }
      })
    );
  }
}
