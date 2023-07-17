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

// otp generating selector:
selectFeature = (state: appStateInterface) => state.otp;
export const otp_loadingSelector = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const otp_dataSelector = createSelector(selectFeature, (state) => {
  return state?.data;
});
export const otp_errorSelector = createSelector(selectFeature, (state) => {
  return state?.error;
});

// search result selector:
selectFeature = (state: appStateInterface) => state.search;
export const search_loadingSelector = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const search_resultSelector = createSelector(selectFeature, (state) => {
  return state?.data;
});
export const search_errorSelector = createSelector(selectFeature, (state) => {
  return state?.error;
});

// download template selector:
selectFeature = (state: appStateInterface) => state.downloadCode;
export const downloadCode_loadingSelector = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const downloadCode_resultSelector = createSelector(
  selectFeature,
  (state) => {
    return state?.data;
  }
);
export const downloadCode_errorSelector = createSelector(
  selectFeature,
  (state) => {
    return state?.error;
  }
);

// change font size selector:
selectFeature = (state: appStateInterface) => state.fontSize;
export const fontSize_selector = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const fontSize_resultSelector = createSelector(
  selectFeature,
  (state) => {
    return state?.data;
  }
);
export const fontSize_errorSelector = createSelector(selectFeature, (state) => {
  return state?.error;
});

// change font size selector:
selectFeature = (state: appStateInterface) => state.tabSize;
export const tabSize_selector = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const tabSize_resultSelector = createSelector(selectFeature, (state) => {
  return state?.data;
});
export const tabSize_errorSelector = createSelector(selectFeature, (state) => {
  return state?.error;
});
