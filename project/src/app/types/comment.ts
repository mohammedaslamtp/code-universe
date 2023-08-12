import { USerData } from './UserData';
import { Template } from './template_types';

export interface comment {
  _id: string;
  user: USerData;
  tempId: Template;
  dateAndTime: Date;
  commentText: string;
  like: USerData[];
  subComment?: comment[];
  mention?: USerData;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
