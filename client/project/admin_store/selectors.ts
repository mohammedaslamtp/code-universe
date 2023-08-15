import { createSelector } from '@ngrx/store';
import { adminAppState } from './admin_types/adminApp';

// adminlogin selector:
export let selectFeature = (state: adminAppState) => state.admin;
export const adminLoginSelector = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const adminLoginData = createSelector(selectFeature, (state) => {
  return state?.data;
});
export const adminLoginError = createSelector(selectFeature, (state) => {
  return state?.error;
});

// get all the users:
export const getUsersSelector = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const getAllUsers = createSelector(selectFeature, (state) => {
  return state?.user_details;
});
export const getUsersError = createSelector(selectFeature, (state) => {
  return state?.error;
});

// blocking users:
export const blockUser = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const blockedUserSelector = createSelector(selectFeature, (state) => {
  return state?.is_blocked;
});
export const blockingFailureSelector = createSelector(
  selectFeature,
  (state) => {
    return state?.error;
  }
);

// unblocking users:
export const unblockUser = createSelector(
  selectFeature,
  (state) => state?.isLoading
);
export const unblockedUserSelector = createSelector(selectFeature, (state) => {
  return state?.is_blocked;
});
export const unblockingFailureSelector = createSelector(
  selectFeature,
  (state) => {
    return state?.error;
  }
);
