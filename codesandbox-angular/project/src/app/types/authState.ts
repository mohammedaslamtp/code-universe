import { LOGIN } from '../components/user/login/userLogin';
import { User } from '../components/user/signup/newUser';
import { OTP } from './OTP';
import { Codes } from './template_types';

export interface authState {
  isLoading: boolean | null;
  error: string | null;
  data: LOGIN | User | OTP | Codes | null;
}
