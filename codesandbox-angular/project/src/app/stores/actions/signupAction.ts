import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/components/user/signup/newUser';

export const Registration = createAction(
  '[register] register data',
  props<{ register: User }>()
);

export const RegisterSuccess = createAction(
  '[register] register success',
  props<{ register: User }>()
);

export const RegisterFailure = createAction(
  '[register] register failed',
  props<{ error: string | null }>()
);
