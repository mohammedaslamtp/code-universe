import { USerData } from './UserData';

// types of templates collection:
export type Templates = Template[];
export interface Template {
  _id: string;
  title: string;
  template_id: string;
  html: string;
  css: string;
  js: string;
  isGuest: boolean;
  isPrivate: boolean;
  like: [string];
  comment: [string];
  views: [string];
  __v: number;
  user: USerData;
  upVote: [USerData | string];
  downVote: [USerData | string];
  createdAt: string;
  updatedAt: string;
}
// type of user collection:
export interface User {
  user_otp: UserOtp;
  _id: string;
  full_name: string;
  email: string;
  password: string;
  phone: number;
  pinned_items: PinnedItem[];
  followers: Follower[];
  following: Following[];
  is_spam: boolean;
  is_disabled: boolean;
  otp_verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface UserOtp {}
export interface PinnedItem {}
export interface Follower {}
export interface Following {}

export type Codes = Code[];
export interface Code {
  _id: string;
  title: string;
  template_id: string;
  html: string;
  css: string;
  js: string;
  isGuest: boolean;
  like: [string];
  views: [string];
  isPrivate: boolean;
  __v: number;
  user: string;
  upVote: [USerData | string];
  downVote: [USerData | string];
  userData: User[];
}
