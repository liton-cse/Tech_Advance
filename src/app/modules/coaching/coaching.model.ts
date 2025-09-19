import mongoose, { Schema, model, Types } from 'mongoose';
import {
  ICoachingDetails,
  ICoachingUser,
  ICoachingDate,
  ICoachingSlot,
} from './coaching.interface';
import { string } from 'zod';

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
    date: { type: String, required: true },
    time: { type: [TimeSlotSchema], required: true },
  },
  { timestamps: true }
);

const coachingSlotSchema = new Schema<ICoachingSlot>({
  value: { type: String },
  flag: { type: Number, default: 0 },
});

const dateSchema = new Schema<ICoachingDate>({
  date: { type: String, required: true },
  slot1: { type: coachingSlotSchema },
  slot2: { type: coachingSlotSchema },
  slot3: { type: coachingSlotSchema },
});

const coachingDetailsSchema = new Schema<ICoachingDetails>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    details: {
      type: [dateSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// 🪄 Clean expired dates before saving
coachingDetailsSchema.pre('save', function (next) {
  const today = new Date().toISOString().split('T')[0];

  // ✅ Filter & reassign with proper cast
  this.details = (this.details as unknown as ICoachingDate[]).filter(
    (d: ICoachingDate) => d.date >= today
  ) as unknown as Types.DocumentArray<ICoachingDate>;

  next();
});
//  Also clean expired dates before updating
//  Clean expired dates before updating
coachingDetailsSchema.pre('findOneAndUpdate', function (next) {
  const today = new Date().toISOString().split('T')[0];
  const update: any = this.getUpdate();

  if (update.details) {
    update.details = (update.details as ICoachingDate[]).filter(
      (d: ICoachingDate) => d.date >= today
    );
  }
  next();
});

export const CoachingDetailsModel = mongoose.model<ICoachingDetails>(
  'CoachingDetails',
  coachingDetailsSchema
);

export const CoachingUserModel = mongoose.model<ICoachingUser>(
  'CoachingUser',
  UserSchema
);
