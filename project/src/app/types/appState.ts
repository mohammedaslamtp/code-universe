import { authState } from './authState';
import { Code } from './code';
import { apiRes } from './defulatApiRes';

export interface appStateInterface {
  loginData: authState;
  registerData: authState;
  code: Code;
  otp:authState;
  search:authState;
  downloadCode:authState;
  fontSize:authState;
  tabSize:authState;
}
