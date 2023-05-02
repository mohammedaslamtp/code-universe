import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of } from 'rxjs';
import * as loginAction from './actions/loginAction';
import { Router } from '@angular/router';
import * as registerAction from './actions/signupAction';

import * as codeRun from './actions/codeRun';

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
            if (_loginRes.accessToken && _loginRes?.refreshToken)
              this.userService.storeToken(
                _loginRes?.accessToken,
                _loginRes?.refreshToken
              );
            this.route.navigate(['/home']);
            return loginAction.LoginSuccess({ login: _loginRes });
          }),
          catchError((err) => {
            console.log('***', err);
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
            if (_registerRes.accessToken && _registerRes.refreshToken)
              this.userService.storeToken(
                _registerRes?.accessToken,
                _registerRes?.refreshToken
              );
            this.route.navigate(['/home']);
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

  // code running:
  runCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(codeRun.codeRunning),
      mergeMap((res) => {
        return this.userService
          .runCode(res.html, res.css, res.js, res.title,res.random)
          .pipe(
            map((_codeRunRes) => {
              console.log('code running result:-- ', _codeRunRes);
              if (_codeRunRes) console.log(_codeRunRes);
              return codeRun.codeRunningSuccess({ codeRun: _codeRunRes });
            }),
            catchError((err) => {
              console.log('code running error***: ', err);
              return of(codeRun.codeRunningFailure({ error: err.error }));
            })
          );
      })
    )
  );
}
