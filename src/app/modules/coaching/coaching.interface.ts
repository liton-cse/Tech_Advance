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

export interface IDate extends Document {
  date: string;
  slot1: string;
  slot2: string;
  slot3: string;
}
export interface ICoachingDetails extends Document {
  name: string;
  description: string;
  details?: Types.DocumentArray<IDate>;
}
