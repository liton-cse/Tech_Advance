import { CoachingUserModel } from './coaching.model';
import { ICoachingUser } from './coaching.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

// Create User
const createCoachingUser = async (payload: ICoachingUser) => {
  const user = await CoachingUserModel.create(payload);
  return user;
};

// Get All Users (with optional search by name/email)
const getAllCoachingUsers = async (search?: string) => {
  const filter: any = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  return await CoachingUserModel.find(filter);
};

const getUserById = async (id: string) => {
  const user = await CoachingUserModel.findById(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

// Update User
const updateCoachingUser = async (
  id: string,
  payload: Partial<ICoachingUser>
) => {
  const user = await CoachingUserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

// Delete User
const deleteCoachingUser = async (id: string) => {
  const user = await CoachingUserModel.findByIdAndDelete(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

// Approve/Deny Slot for a given day
const updateSlotStatus = async (
  userId: string,
  date: string,
  slotRange: string,
  action: 'APPROVE' | 'DENY'
) => {
  const user = await CoachingUserModel.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  // Ensure same date
  const formattedDate = new Date(date).toISOString().split('T')[0];
  const userDate = new Date(user.date).toISOString().split('T')[0];
  if (formattedDate !== userDate) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Date does not match user booking date'
    );
  }

  // Find slot
  const slot = user.time.find(s => s.range === slotRange);
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found');

  // Update flag
  slot.flag = action === 'APPROVE';

  // Update status accordingly
  user.status = action === 'APPROVE' ? 'APPROVED' : 'DENIED';

  await user.save();
  return user;
};

export const CoachingService = {
  createCoachingUser,
  getAllCoachingUsers,
  updateCoachingUser,
  deleteCoachingUser,
  updateSlotStatus,
};
