import { LOGIN } from "../components/user/login/userLogin";
import { User } from "../components/user/signup/newUser";

export interface authState {
  isLoading: boolean | null;
  error: string | null;
  data: LOGIN| User | null;
}
