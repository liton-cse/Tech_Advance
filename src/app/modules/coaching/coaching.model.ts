import { Schema, model, Document } from 'mongoose';
import { ICoachingUser } from './coaching.interface';

const TimeSlotSchema = new Schema(
  {
    range: { type: String, required: true },
    flag: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<ICoachingUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'DENIED'],
      default: 'PENDING',
    },
    date: { type: Date, required: true },
    time: { type: [TimeSlotSchema], required: true },
  },
  { timestamps: true }
);

export const CoachingUserModel = model<ICoachingUser>(
  'CoachingUser',
  UserSchema
);
