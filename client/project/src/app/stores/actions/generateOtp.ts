import { createAction, props } from '@ngrx/store';
import { OTP } from 'src/app/types/OTP';

export const otpRequest = createAction('[otp] request');

export const otpSendingSuccess = createAction(
  '[otp] otp sent successfully',
  props<{ otpData:OTP }>()
);

export const otpSendingFailure = createAction(
  '[otp] otp sending process failed',
  props<{ error: string | null }>()
);
