import { createAction, props } from '@ngrx/store';
import { apiRes } from 'src/app/types/defulatApiRes';

export const changeTabSize = createAction(
  '[tabSize] data',
  props<{ TabSize:number }>()
);

export const changeTabSizeSuccess = createAction(
  '[tabSize] change Tab size success',
  props<{ response: apiRes }>()
);

export const changeTabSizeFailure = createAction(
  '[tabSize] change Tab size failed',
  props<{ error: string | null  }>()
);
