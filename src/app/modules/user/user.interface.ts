import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  role: USER_ROLES;
  contact: string;
  email: string;
  password: string;
  location: string;
  image?: string;
  userStatus: 'active' | 'blocked';
  status: 'active' | 'delete';
  verified: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
  blockUser(id: string): Promise<IUser | null>;
  unblockUser(id: string): Promise<IUser | null>;
} & Model<IUser>;
