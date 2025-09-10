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
  if (search === 'APPROVED') {
    return await CoachingUserModel.find({
      $or: [{ status: { $regex: search, $options: 'i' } }],
    });
  } else if (search === 'DENIED') {
    return await CoachingUserModel.find({
      $or: [{ status: { $regex: search, $options: 'i' } }],
    });
  } else if (search === 'PENDING') {
    return await CoachingUserModel.find({
      $or: [{ status: { $regex: search, $options: 'i' } }],
    });
  } else {
    return await CoachingUserModel.find({
      $or: [{ name: { $regex: search, $options: 'i' } }],
    });
  }
};

//get all Coaching user from database
const getUser = async () => {
  const user = await CoachingUserModel.find();
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

// get all approve and denied data from database..

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
  range: string,
  action: 'APPROVED' | 'DENIED'
) => {
  const user = await CoachingUserModel.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const slot = user.time.find(
    s => s.range.trim().toLowerCase() === range.trim().toLowerCase()
  );

  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found');

  slot.flag = action === 'APPROVED' ? true : false;
  user.status = action === 'APPROVED' ? 'APPROVED' : 'DENIED';

  user.markModified('time');
  await user.save();
  return user;
};

export const CoachingService = {
  createCoachingUser,
  getAllCoachingUsers,
  updateCoachingUser,
  deleteCoachingUser,
  updateSlotStatus,
  getUser,
};
