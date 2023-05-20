import { createReducer, on } from '@ngrx/store';
import * as ad_loginAction from '../admin_store/actions/admin_login';
import * as getData from '../admin_store/actions/users_data';
import * as blockingUsers from '../admin_store/actions/blockUser';
import * as unblockingUsers from '../admin_store/actions/unblockUser';
import { adminAuth } from './admin_types/adminState';

// initial state:
export const initialState: adminAuth = {
  isLoading: false,
  error: null,
  data: null,
  user_details: [],
};

// admin login reducer:
export const adminLoginReducer = createReducer(
  initialState,

  // admin login reducer:
  on(ad_loginAction.ad_LoginData, (state) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  })),
  on(ad_loginAction.ad_LoginSuccess, (state, action) => ({
    ...state,
    isLoading: true,
    data: action.admin_login,
    error: null,
  })),
  on(ad_loginAction.ad_LoginFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
    data: null,
  })),

  // get all users:
  on(getData.getUsers, (state) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  })),
  on(getData.getUsersSuccess, (state, action) => ({
    ...state,
    isLoading: true,
    user_details: action.all_users,
    error: null,
  })),
  on(getData.getUsersFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
    data: null,
  })),

  // blocking user:
  on(blockingUsers.blockUser, (state) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  })),
  on(blockingUsers.blockUserSuccess, (state, action) => ({
    ...state,
    isLoading: true,
    userBlocked: action.userBlocked,
    error: null,
  })),
  on(blockingUsers.blockUserFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
    data: null,
  })),

  // unblocking user:
  on(unblockingUsers.unblockUser, (state) => ({
    ...state,
    isLoading: true,
    data: null,
    error: null,
  })),
  on(unblockingUsers.unblockUserSuccess, (state, action) => ({
    ...state,
    isLoading: true,
    userUnblocked: action.userUnblocked,
    error: null,
  })),
  on(unblockingUsers.unblockUserFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
    data: null,
  }))
);
