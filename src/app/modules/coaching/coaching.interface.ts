import { Types } from 'mongoose';

export type StatusType = 'PENDING' | 'APPROVED' | 'DENIED';

export interface ITimeSlot extends Document {
  range: string;
  flag: boolean;
}

export interface ICoachingUser extends Document {
  name: string;
  email: string;
  status: StatusType;
  date: string;
  time: ITimeSlot[];
}

export interface ICoachingSlot {
  value: string;
  flag: number;
}

export interface ICoachingDate {
  date: string;
  slot1: ICoachingSlot;
  slot2: ICoachingSlot;
  slot3: ICoachingSlot;
}
export interface ICoachingDetails extends Document {
  name: string;
  description: string;
  details: ICoachingDate[];
}
