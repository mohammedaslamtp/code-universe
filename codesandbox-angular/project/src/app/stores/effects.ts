import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of } from 'rxjs';
import * as loginAction from './actions/loginAction';
import * as registerAction from './actions/signupAction';
import * as otpRequestAction from './actions/generateOtp';
import * as searchAction from './actions/search';
import Swal from 'sweetalert2';
import { otpSentLoad } from '../components/user/otp/otp.component';
import { MainService } from '../services/main.service';
import { Codes, Template, Templates } from '../types/template_types';

@Injectable()
export class effects {
  constructor(
    private _actions$: Actions,
    private _userService: UserService,
    private _mainService: MainService,
    private _route: Router
  ) {}

  // login effect:

  getLoginData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(loginAction.LoginData),
      mergeMap((res) => {
        return this._userService.login(res.login).pipe(
          map((_loginRes) => {
            if (_loginRes.accessToken && _loginRes?.refreshToken)
              this._userService.storeToken(
                _loginRes?.accessToken,
                _loginRes?.refreshToken
              );
            if (this._userService.isPopupLog() == false) {
              this._route.navigate(['/home']);
            }
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
    this._actions$.pipe(
      ofType(registerAction.Registration),
      mergeMap((res) => {
        return this._userService.signup(res.register).pipe(
          map((_registerRes) => {
            if (_registerRes.accessToken && _registerRes.refreshToken)
              this._userService.storeToken(
                _registerRes?.accessToken,
                _registerRes?.refreshToken
              );
            this._route.navigate(['/home']);
            return registerAction.RegisterSuccess({ register: _registerRes });
          }),
          catchError((err) => {
            return of(registerAction.RegisterFailure({ error: err.error }));
          })
        );
      })
    )
  );

  // otp effects:
  getOtpResponse$ = createEffect(() =>
    this._actions$.pipe(
      ofType(otpRequestAction.otpRequest),
      mergeMap((res) => {
        console.log('otp effect res: ', res);
        otpSentLoad.next(true);
        return this._userService.genreateOtp().pipe(
          map((_otpRes) => {
            console.log('result otp generation: ', _otpRes);
            setTimeout(() => {
              if (_otpRes.isGenerated) {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                  },
                });
                Toast.fire({
                  icon: 'success',
                  title: 'OTP send successfully',
                });
              }
            }, 2500);
            otpSentLoad.next(false);
            return otpRequestAction.otpSendingSuccess({ otpData: _otpRes });
          }),
          catchError((err) => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            Toast.fire({
              icon: 'error',
              title: `Please check your connection? and retry`,
            });
            return of(otpRequestAction.otpSendingFailure({ error: err.error }));
          })
        );
      })
    )
  );

  // search effects:
  getSearchResult$ = createEffect(() =>
    this._actions$.pipe(
      ofType(searchAction.SearchQuery),
      mergeMap((res) => {
        return this._mainService.search(res.q).pipe(
          map((searchResult:any) => {
            console.log(searchResult);
            return searchAction.SearchSuccess({ search: searchResult });
          }),
          catchError((err) => {
            return of(searchAction.SearchFailure({ error: err.error }));
          })
        );
      })
    )
  );
}
