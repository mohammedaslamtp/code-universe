import { createAction, props } from '@ngrx/store';
import { search } from '../../types/search';
import { Codes } from 'src/app/types/template_types';

export const SearchQuery = createAction(
  '[search] search query',
  props<{ q: string }>()
);

export const SearchSuccess = createAction(
  '[search] search success',
  props<{ search: Codes }>()
);

export const SearchFailure = createAction(
  '[search] search failed',
  props<{ error: string | null }>()
);
