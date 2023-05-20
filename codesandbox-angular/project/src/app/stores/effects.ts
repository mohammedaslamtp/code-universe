import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of } from 'rxjs';
import * as loginAction from './actions/loginAction';
import * as registerAction from './actions/signupAction';
import * as otpRequestAction from './actions/generateOtp';
import Swal from 'sweetalert2';
import { otpSentLoad } from '../components/user/otp/otp.component';

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
            if (this.userService.isPopupLog() == false) {
              this.route.navigate(['/home']);
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
    this.actions$.pipe(
      ofType(registerAction.Registration),
      mergeMap((res) => {
        return this.userService.signup(res.register).pipe(
          map((_registerRes) => {
            if (_registerRes.accessToken && _registerRes.refreshToken)
              this.userService.storeToken(
                _registerRes?.accessToken,
                _registerRes?.refreshToken
              );
            this.route.navigate(['/home']);
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
    this.actions$.pipe(
      ofType(otpRequestAction.otpRequest),
      mergeMap((res) => {
        console.log('otp effect res: ', res);
        otpSentLoad.next(true);
        return this.userService.genreateOtp().pipe(
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
}
