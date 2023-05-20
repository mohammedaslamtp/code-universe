import { createAction, props } from '@ngrx/store';

export const unblockUser = createAction('unblock user', props<{ id: string }>());

export const unblockUserSuccess = createAction(
  'unblock user success',
  props<{ userUnblocked: any }>()
);

export const unblockUserFailure = createAction(
  'unblocking user failed',
  props<{ error: string | null }>()
);
