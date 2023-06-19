import { createAction, createReducer, on } from '@ngrx/store';
import { authState } from '../types/authState';
import * as loginAction from './actions/loginAction';
import * as regAction from './actions/signupAction';
import * as otpAction from './actions/generateOtp';
import * as searchAction from './actions/search';
import * as downloadAction from './actions/downloadCodes';

// initial state:
export const initialState: authState = {
  isLoading: false,
  error: null,
  data: null,
};

// login reducer:
export const loginReducer = createReducer(
  initialState,
  on(loginAction.LoginData, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(loginAction.LoginSuccess, (state, action) => ({
    ...state,
    isLoading: true,
    data: action.login,
    error: null,
  })),
  on(loginAction.LoginFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
    data: null,
  }))
);

// registration/signup reducer:
export const registerReducer = createReducer(
  initialState,
  on(regAction.Registration, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(regAction.RegisterSuccess, (state, action) => ({
    ...state,
    isLoading: true,
    data: action.register,
    error: null,
  })),
  on(regAction.RegisterFailure, (state, action) => ({
    ...state,
    isLoading: false,
    data: null,
    error: action.error,
  }))
);

// otp request reducer:
export const otpRequestReducer = createReducer(
  initialState,
  on(otpAction.otpRequest, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(otpAction.otpSendingSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    data: action.otpData,
    error: null,
  })),
  on(otpAction.otpSendingFailure, (state, action) => ({
    ...state,
    isLoading: false,
    data: null,
    error: action.error,
  }))
);

// search templates
export const searchReducer = createReducer(
  initialState,
  on(searchAction.SearchQuery, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(searchAction.SearchSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    data: action.search,
    error: null,
  })),
  on(searchAction.SearchFailure, (state, action) => ({
    ...state,
    isLoading: false,
    data: null,
    error: action.error,
  }))
);

// download templates
export const downloadCodesReducer = createReducer(
  initialState,
  on(downloadAction.codesDownload, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(downloadAction.downloadCodesSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    data: action.downloadData,
    error: null,
  })),
  on(downloadAction.downloadCodesFailure, (state, action) => ({
    ...state,
    isLoading: false,
    data: null,
    error: action.error,
  }))
);
