import { LOGIN } from "../components/user/login/userLogin";
import { User } from "../components/user/signup/newUser";
import { OTP } from "./OTP";

export interface authState {
  isLoading: boolean | null;
  error: string | null;
  data: LOGIN| User | OTP | null;
}
