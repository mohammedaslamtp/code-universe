import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { USerData } from '../types/UserData';

@Injectable({
  providedIn: 'root',
})
export class AccountOwnerGuard implements CanActivate, OnDestroy {
  subs_userData!: Subscription;
  subs_params!: Subscription;
  userId!: string;
  paramId!: string;
  constructor(
    private _routerActicated: ActivatedRoute,
    private _userService: UserService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.subs_params = this._routerActicated.params.subscribe((param) => {
      this.paramId = param['id'];
      this.subs_userData = this._userService.getUserData().subscribe((data) => {
        this.userId = data._id;
      });
    });
    if (this.userId == this.paramId) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    console.log('unsubscribing')
    this.subs_params.unsubscribe();
    this.subs_userData.unsubscribe();
  }
}
