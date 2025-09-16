import { CoachingUserModel } from './coaching.model';
import { ICoachingUser } from './coaching.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

// Create Coaching User
const createCoachingUser = async (payload: ICoachingUser) => {
  const user = await CoachingUserModel.create(payload);
  return user;
};

// Get All Users (with optional search by name/approve/pending/denied)
const getAllSearchCoachingUsers = async (search: string) => {
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

//get coaching user by Id.
const getUserById = async (id: string) => {
  const user = await CoachingUserModel.findById(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
  return user;
};

//get all Coaching user from database
const getUser = async () => {
  const user = await CoachingUserModel.find();
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

// Update Coaching User by Id.
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

// Delete User by Id.
const deleteCoachingUser = async (id: string) => {
  const user = await CoachingUserModel.findByIdAndDelete(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

// Approve/Deny Slot od any coaching by specific Id.
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
// @get total coaching user.
const getTotalCoachingUsers = async () => {
  return await CoachingUserModel.countDocuments();
};

// @get total approved coaching user.
const getTotalApprovedCoachingUsers = async () => {
  return await CoachingUserModel.countDocuments({
    status: { $in: ['APPROVED'] },
  });
};

// @get total denied coaching user.
const getTotalDeniedCoachingUsers = async () => {
  return await CoachingUserModel.countDocuments({
    status: { $in: ['DENIED'] },
  });
};
export const CoachingService = {
  createCoachingUser,
  getAllSearchCoachingUsers,
  updateCoachingUser,
  deleteCoachingUser,
  updateSlotStatus,
  getUser,
  getUserById,
  getTotalCoachingUsers,
  getTotalApprovedCoachingUsers,
  getTotalDeniedCoachingUsers,
};
