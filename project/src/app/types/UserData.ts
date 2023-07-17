export interface USerData {
  _id: string;
  full_name: string;
  display_name: string;
  email: string;
  password: string;
  pinned_items: any[];
  followers: any[];
  following: any[];
  is_spam: boolean;
  is_disabled: boolean;
  otp_verified: boolean;
  createdAt: string;
  avatar: string | null;
  bio: string;
  location: string;
  updatedAt: string;
  linkedin_link: string;
  twitter_link: string;
  __v: number;
}
