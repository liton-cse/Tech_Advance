import { CoachingUserModel } from './coaching.model';
import { ICoachingUser } from './coaching.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { CoachingDetailsModel } from './coaching.model';
import { ICoachingDetails, ICoachingDate } from './coaching.interface';

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
//----------------Coach Section----------
// 1️⃣ Create coach (name + description)
const createCoach = async (
  name: string,
  description: string
): Promise<ICoachingDetails> => {
  const existing = await CoachingDetailsModel.findOne({ name });
  if (existing) throw new Error('Coach already exists');

  const coach = new CoachingDetailsModel({ name, description });
  return await coach.save();
};

// 2️⃣ Update coach name/description
const updateCoach = async (
  coachId: string,
  data: Partial<{ name: string; description: string }>
): Promise<ICoachingDetails | null> => {
  return await CoachingDetailsModel.findByIdAndUpdate(coachId, data, {
    new: true,
  });
};

// 3️⃣ Delete coach
const deleteCoach = async (
  coachId: string
): Promise<ICoachingDetails | null> => {
  return await CoachingDetailsModel.findByIdAndDelete(coachId);
};

// 7️⃣ Get all coaches
const getAllCoaches = async (): Promise<ICoachingDetails[]> => {
  return await CoachingDetailsModel.find();
};

// 8️⃣ Get coach by ID
const getCoachById = async (
  coachId: string
): Promise<ICoachingDetails | null> => {
  return await CoachingDetailsModel.findById(coachId);
};

// 4️⃣ Add date with default slots
const addDateWithDefaultSlots = async (
  coachId: string,
  date: string
): Promise<ICoachingDetails | null> => {
  const coach = await CoachingDetailsModel.findById(coachId);
  if (!coach) return null;
  const exists = coach.details.find(d => d.date === date);
  if (exists) throw new Error('Date already exists');

  return await CoachingDetailsModel.findByIdAndUpdate(
    coachId,
    {
      $push: {
        details: {
          date,
          slot1: { value: '9am-10am' },
          slot2: { value: '11am-12pm' },
          slot3: { value: '3pm-4pm' },
        },
      },
    },
    { new: true }
  );
};

// 5️⃣ Update slot times
// CoachingService.ts
const updateSlot = async (
  coachId: string,
  date: string,
  updates: Partial<Pick<ICoachingDate, 'slot1' | 'slot2' | 'slot3'>>
): Promise<ICoachingDetails | null> => {
  const updateObj = Object.fromEntries(
    Object.entries(updates).map(([slotKey, slotValue]) => [
      `details.$.${slotKey}`,
      slotValue,
    ])
  );

  const updatedCoach = await CoachingDetailsModel.findOneAndUpdate(
    { _id: coachId, 'details.date': date },
    { $set: updateObj },
    { new: true }
  );

  return updatedCoach;
};

// Delete slot
export const deleteSlot = async (
  coachId: string,
  date: string,
  slotKey: 'slot1' | 'slot2' | 'slot3'
): Promise<ICoachingDetails | null> => {
  // Find the coach with that date
  const coach = await CoachingDetailsModel.findOne({
    _id: coachId,
    'details.date': date,
  });
  if (!coach) return null;

  const dateDoc = coach.details.find(d => d.date === date);
  if (!dateDoc) return null;

  // Build update object (set the slot to null)
  const update: any = { [`details.$.${slotKey}`]: null };

  // If all slots would be empty, remove the whole date instead
  const otherSlots = ['slot1', 'slot2', 'slot3'].filter(s => s !== slotKey);
  const allOthersEmpty = otherSlots.every(
    s => !dateDoc[s as keyof typeof dateDoc]
  );

  if (allOthersEmpty) {
    return await CoachingDetailsModel.findByIdAndUpdate(
      coachId,
      { $pull: { details: { date } } },
      { new: true }
    );
  }

  // Otherwise just clear the requested slot
  return await CoachingDetailsModel.findOneAndUpdate(
    { _id: coachId, 'details.date': date },
    { $set: update },
    { new: true }
  );
};

// 9️⃣ Get slots for a date
const getSlotsByDate = async (
  coachId: string,
  date: string
): Promise<ICoachingDate | null> => {
  const coach = await CoachingDetailsModel.findById(coachId);
  if (!coach) return null;

  const found = coach.details.find(d => d.date === date);
  return found || null;
};

const toggleSlotFlag = async (
  coachId: string,
  date: string,
  slotKey: 'slot1' | 'slot2' | 'slot3'
): Promise<ICoachingDetails | null> => {
  // Find the coach with that date
  const coach = await CoachingDetailsModel.findOne({
    _id: coachId,
    'details.date': date,
  });
  if (!coach) return null;

  const dateDoc = coach.details.find(d => d.date === date);
  if (!dateDoc) return null;

  const slot = dateDoc[slotKey];
  if (!slot) throw new Error(`Slot ${slotKey} not found for date ${date}`);

  // Toggle flag
  const newFlag = slot.flag === 0 ? 1 : 0;

  const updatedCoach = await CoachingDetailsModel.findOneAndUpdate(
    { _id: coachId, 'details.date': date },
    { $set: { [`details.$.${slotKey}.flag`]: newFlag } },
    { new: true }
  );

  return updatedCoach;
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
  //Coach
  createCoach,
  updateCoach,
  deleteCoach,
  addDateWithDefaultSlots,
  updateSlot,
  deleteSlot,
  getAllCoaches,
  getCoachById,
  getSlotsByDate,
  toggleSlotFlag,
};
