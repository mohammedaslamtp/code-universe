import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of } from 'rxjs';
import * as loginAction from './actions/loginAction';
import { Router } from '@angular/router';
import * as registerAction from './actions/signupAction';

@Injectable()
export class effects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private route: Router
  ) {}

  // login effect:
  getLoginData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginAction.LoginData),
      mergeMap((res) => {
        return this.userService.login(res.login).pipe(
          map((_loginRes) => {
            if (_loginRes.accessToken)
              this.userService.storeToken(_loginRes?.accessToken);
            this.route.navigate(['/home']);
            return loginAction.LoginSuccess({ login: _loginRes });
          }),
          catchError((err) => {
            return of(loginAction.LoginFailure({ error: err.error }));
          })
        );
      })
    )
  );

  // signup effects:
  getRegisterData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerAction.Registration),
      mergeMap((res) => {
        return this.userService.signup(res.register).pipe(
          map((_registerRes) => {
            console.log('register result:-- ', _registerRes);
            if (_registerRes.accessToken)
              this.userService.storeToken(_registerRes?.accessToken);
            this.route.navigate(['/user/otp']);
            return registerAction.RegisterSuccess({ register: _registerRes });
          }),
          catchError((err) => {
            console.log('register error***: ', err);
            return of(registerAction.RegisterFailure({ error: err.error }));
          })
        );
      })
    )
  );
}
