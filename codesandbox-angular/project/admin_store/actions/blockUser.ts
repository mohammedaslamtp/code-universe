import { createAction, props } from '@ngrx/store';

export const blockUser = createAction('block user', props<{ id: string }>());

export const blockUserSuccess = createAction(
  'block user success',
  props<{ userBlocked: any }>()
);

export const blockUserFailure = createAction(
  'blocking user failed',
  props<{ error: string | null }>()
);
