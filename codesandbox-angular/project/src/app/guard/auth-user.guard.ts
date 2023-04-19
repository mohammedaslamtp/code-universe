import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthUserGuard implements CanActivate {
  constructor(private user_api: UserService, private route: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.user_api.loggedIn()) {
      // User is logged in, so allow access to the requested route
      return false;
    } else {
      // User is not logged in, so redirect to the login/signup page
      return true;
    }
  }
}
