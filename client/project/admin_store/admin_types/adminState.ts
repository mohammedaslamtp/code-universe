import { ad_login } from 'src/app/components/admin/ad-login/adminLogin';

export interface adminAuth {
  isLoading: boolean | null;
  error: string | null;
  data: ad_login | null;
  user_details?: any[];
  is_blocked?: boolean | string | null;
  
}
