import { Document, Types } from 'mongoose';
export interface IGroup extends Document {
  name: string;
  image?: string;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  group: Types.ObjectId;
  user: Types.ObjectId;
  description: string;
  image?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReply extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  image?: string[];
  createdAt: Date;
}

export interface IComment extends Document {
  group: Types.ObjectId;
  post: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  image?: string[];
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}
