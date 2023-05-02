import { createAction, props } from '@ngrx/store';
import { ad_login } from 'src/app/components/admin/ad-login/adminLogin';

export const ad_LoginData = createAction(
  '[admin_login] admin login data',
  props<{ admin_login: ad_login }>()
);

export const ad_LoginSuccess = createAction(
  '[admin_login] admin login success',
  props<{ admin_login: ad_login }>()
);

export const ad_LoginFailure = createAction(
  '[admin_login] admin login failed',
  props<{ error: string | null }>()
);
