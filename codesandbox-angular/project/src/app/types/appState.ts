import { authState } from './authState';
import { Code } from './code';

export interface appStateInterface {
  loginData: authState;
  registerData: authState;
  code: Code;
}
