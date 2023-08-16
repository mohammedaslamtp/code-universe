import { createAction, props } from '@ngrx/store';
import { CodesForDownload } from 'src/app/types/downloadCode';

export const codesDownload = createAction(
  '[download] download id',
  props<{ id: string }>()
);

export const downloadCodesSuccess = createAction(
  '[download] download codes success',
  props<{ downloadData: CodesForDownload }>()
);

export const downloadCodesFailure = createAction(
  '[download] download codes failed',
  props<{ error: string | null }>()
);
