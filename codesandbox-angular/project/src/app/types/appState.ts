import { authState } from './authState';
import { Code } from './code';
import { OTP } from './OTP';

export interface appStateInterface {
  loginData: authState;
  registerData: authState;
  code: Code;
  otp:authState;
  search:authState;
}
