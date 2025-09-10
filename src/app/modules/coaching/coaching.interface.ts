export type StatusType = 'PENDING' | 'APPROVED' | 'DENIED';

export interface ITimeSlot {
  range: string;
  flag: boolean;
}

export interface ICoachingUser {
  name: string;
  email: string;
  status: StatusType;
  date: string;
  time: ITimeSlot[];
}
