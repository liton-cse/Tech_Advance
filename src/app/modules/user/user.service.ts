import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { IPaginationOptions } from '../../../types/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  //set role
  payload.role = USER_ROLES.USER;
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return isExistUser;
};

const getAllUsersFromDB = async (
  paginationOptions: IPaginationOptions
): Promise<{ meta: any; data: Partial<IUser>[] }> => {
  const { skip, limit, sortBy, sortOrder, page } =
    paginationHelper.calculatePagination(paginationOptions);
  const users = await User.find({ role: { $ne: 'SUPER_ADMIN' } })
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);
  const total = await User.countDocuments({ role: { $ne: 'SUPER_ADMIN' } });
  return {
    meta: { page, limit, total },
    data: users,
  };
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getTotalUsers = async () => {
  return await User.countDocuments({ role: { $ne: 'SUPER_ADMIN' } });
};

const searchUsersToDB = async (searchTerm: string) => {
  return await User.find({
    role: { $nin: ['SUPER_ADMIN', 'ADMIN'] },
    $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
  });
};

const filterUsersByDateFromDB = async (
  sort: 'newest' | 'oldest' = 'newest'
) => {
  return await User.find({ role: { $ne: 'SUPER_ADMIN' } }).sort({
    createdAt: sort === 'newest' ? -1 : 1,
  });
};

const blockUser = async (id: string) => {
  return await User.blockUser(id);
};

const unblockUser = async (id: string) => {
  return await User.unblockUser(id);
};
const getBlockedUsers = async () => {
  return await User.find({ userStatus: 'blocked' });
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getTotalUsers,
  searchUsersToDB,
  filterUsersByDateFromDB,
  getAllUsersFromDB,
  blockUser,
  unblockUser,
  getBlockedUsers,
};
