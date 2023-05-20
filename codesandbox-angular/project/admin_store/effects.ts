import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import * as loginAction from '../admin_store/actions/admin_login';
import * as getData from '../admin_store/actions/users_data';
import * as blockUsers from '../admin_store/actions/blockUser';
import * as unblockUser from '../admin_store/actions/unblockUser';
import Swal from 'sweetalert2';

@Injectable()
export class admin_effects {
  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private route: Router
  ) {}

  Toast: any = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  //  admin login:
  getLoginData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginAction.ad_LoginData),
      mergeMap((res) => {
        return this.adminService.login(res.admin_login).pipe(
          map((_loginRes) => {
            if (_loginRes.adminToken)
              localStorage.setItem('admin_token', _loginRes?.adminToken);
            console.log('result: ', _loginRes);
            this.Toast.fire({
              icon: 'success',
              title: 'Admin Confirmed👍',
            });
            this.route.navigate(['/admin']);

            return loginAction.ad_LoginSuccess({ admin_login: _loginRes });
          }),
          catchError((err) => {
            console.log('admin login error! ', err);
            return of(loginAction.ad_LoginFailure({ error: err.error }));
          })
        );
      })
    )
  );

  // get users details:
  getUsersDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getData.getUsers),
      mergeMap((res) => {
        return this.adminService.getUsersData().pipe(
          map((_loginRes) => {
            if (_loginRes) console.log('get users result: ', _loginRes);
            return getData.getUsersSuccess({ all_users: _loginRes });
          }),
          catchError((err) => {
            console.log('admin login error! ', err);
            return of(getData.getUsersFailure({ error: err.error }));
          })
        );
      })
    )
  );

  // block user effect:
  blockUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(blockUsers.blockUser),
      mergeMap((res) => {
        return this.adminService.blockUser(res.id).pipe(
          map((_loginRes) => {
            if (_loginRes) console.log('user blocking process: ', _loginRes);
            return blockUsers.blockUserSuccess({ userBlocked: _loginRes });
          }),
          catchError((err) => {
            console.log('admin login error! ', err);
            return of(blockUsers.blockUserFailure({ error: err.error }));
          })
        );
      })
    )
  );

  // unblock user effect:
  unblockUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unblockUser.unblockUser),
      mergeMap((res) => {
        return this.adminService.unblockUser(res.id).pipe(
          map((_loginRes) => {
            if (_loginRes) console.log('user unblocking process: ', _loginRes);
            return unblockUser.unblockUserSuccess({ userUnblocked: _loginRes });
          }),
          catchError((err) => {
            console.log('admin login error! ', err);
            return of(unblockUser.unblockUserFailure({ error: err.error }));
          })
        );
      })
    )
  );
}
