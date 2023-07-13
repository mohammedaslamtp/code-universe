import { createAction, props } from '@ngrx/store';
import { LOGIN } from 'src/app/components/user/login/userLogin';

export const LoginData = createAction(
  '[login] login data',
  props<{ login: LOGIN }>()
);

export const LoginSuccess = createAction(
  '[login] login success',
  props<{ login: LOGIN }>()
);

export const LoginFailure = createAction(
  '[login] login failed',
  props<{ error: string | null }>()
);
