import { createAction, props } from '@ngrx/store';
import { apiRes } from 'src/app/types/defulatApiRes';

export const changeFontSize = createAction(
  '[fontSize] data',
  props<{ fontSize:number }>()
);

export const changeFontSizeSuccess = createAction(
  '[fontSize] change font size success',
  props<{ response: apiRes }>()
);

export const changeFontSizeFailure = createAction(
  '[fontSize] change font size failed',
  props<{ error: string | null  }>()
);
