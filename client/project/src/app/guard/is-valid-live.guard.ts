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
import { skipWork } from './live-coding.guard';

@Injectable()
export class IsValidLiveGuard implements CanActivate {
  isExist!: boolean;
  constructor(private _userService: UserService, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    setTimeout(() => {
      const param = route.paramMap.get('room');
      this._userService.isValidLive(String(param)).subscribe((isExist) => {
        console.log('isExist ', isExist);
        this.isExist = isExist;
        if (isExist == false) {
          skipWork.next(true);
          this._router.navigate(['**'], { skipLocationChange: true });
          return false;
        } else {
          return true;
        }
      });
    }, 0);
    return this.isExist;
  }
}
