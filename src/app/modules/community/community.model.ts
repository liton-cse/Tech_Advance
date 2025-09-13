import { Schema, model, Document, Types } from 'mongoose';
import type { IGroup, IPost, IComment, IReply } from './community.interface';
//community group schema...
const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: 'https://i.ibb.co/z5YHLV9/profile.png' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

//Community postSchema...

const postSchema = new Schema<IPost>(
  {
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true, trim: true },
    image: [{ type: String }],
  },
  { timestamps: true }
);

// community comment schema...
const replySchema = new Schema<IReply>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, trim: true },
    image: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const commentSchema = new Schema<IComment>(
  {
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, trim: true },
    image: [{ type: String }],
    replies: [replySchema],
  },
  { timestamps: true }
);

export const GroupModel = model<IGroup>('Group', groupSchema);
export const PostModel = model<IPost>('Post', postSchema);
export const CommentModel = model<IComment>('Comment', commentSchema);
