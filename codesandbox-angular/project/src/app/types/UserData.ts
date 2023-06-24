export interface USerData {
  _id: string;
  full_name: string;
  email: string;
  password: string;
  phone: number;
  pinned_items: any[];
  followers: any[];
  following: any[];
  is_spam: boolean;
  is_disabled: boolean;
  otp_verified: boolean;
  createdAt: string;
  avatar: string;
  bio: string;
  location: string;
  updatedAt: string;
  __v: number;
}
