import { Types } from 'mongoose';

export interface IFeedBack {
  userId: Types.ObjectId;
  category: string;
  comments: string;
}

export interface ITermsAndCondition {
  content: string;
}
