import { createAction, props } from '@ngrx/store';
import { Code } from 'src/app/types/code';

export const codeRunning = createAction(
  '[code] data',
  props<{ html: Code; css: Code; js: Code, title:Code,random:Code }>()
);

export const codeRunningSuccess = createAction(
  '[code] code running success',
  props<{ codeRun: Code }>()
);

export const codeRunningFailure = createAction(
  '[code] code running failed',
  props<{ error: string | null }>()
);
