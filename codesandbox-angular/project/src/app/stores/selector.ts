import { createSelector } from '@ngrx/store';
import { appStateInterface } from '../types/appState';

// login selector:
export let selectFeature = (state: appStateInterface) => state.loginData;
export const log_loadingSelector = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const log_dataSelector = createSelector(selectFeature, (state) => {
  return state?.data;
});
export const log_errorSelector = createSelector(selectFeature, (state) => {
  return state?.error;
});

// register/signup selector:
selectFeature = (state: appStateInterface) => state.registerData;
export const reg_loadingSelector = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const reg_dataSelector = createSelector(selectFeature, (state) => {
  return state?.data;
});
export const reg_errorSelector = createSelector(selectFeature, (state) => {
  return state?.error;
});
