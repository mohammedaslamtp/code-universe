import { createAction, props } from '@ngrx/store';

export const getUsers = createAction('[Users] users data');

export const getUsersSuccess = createAction(
  '[Users] get users data success',
  props<{ all_users: any }>()
);

export const getUsersFailure = createAction(
  '[Users] get users data failed',
  props<{ error: string | null }>()
);
