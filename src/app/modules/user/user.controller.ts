import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';

// @API Endpoint: api/v1/user
// @Method: POST
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);
// @API Endpoint: api/v1/user
// @Method: GET
const getUserProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserService.getUserProfileFromDB(user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile data retrieved successfully',
      data: result,
    });
  }
);
// @API Endpoint: api/v1/user/all
// @Method: GET
const getAllUserProfile = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, sortBy, sortOrder } = req.query;

  const result = await UserService.getAllUsersFromDB({
    page: Number(page),
    limit: Number(limit),
    sortBy: String(sortBy),
    sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

// @update profile
// @API Endpoint: api/v1/user/:id
// @Method: PUT
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);
// @API Endpoint: api/v1/user/total-user
// @Method: GET
export const totalUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const count = await UserService.getTotalUsers();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Total uses are ${count}',
      data: count,
    });
  }
);

// @API Endpoint: api/v1/user/search?q=liton
// @Method: GET
const searchUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      throw new ApiError(400, 'Search term (q) is required');
    }
    const users = await UserService.searchUsersToDB(q);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Users fetched successfully',
      data: users,
    });
  }
);

// @API Endpoint: api/v1/user/filter
// @Method: GET
const filterUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sort } = req.query;
    if (!sort || typeof sort !== 'string') {
      throw new ApiError(400, 'Filter term  is required');
    }
    const sortOption = sort === 'oldest' ? 'oldest' : 'newest';
    const users = await UserService.filterUsersByDateFromDB(sortOption);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Users fetched successfully',
      data: users,
    });
  }
);

// @apiend point:api/v1/user/block/:id
// @method:patch
const blockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.blockUser(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Users fetched successfully',
      data: user,
    });
  }
);

// @apiend point:api/v1/user/unblock/:id
// @method:patch
const unblockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.unblockUser(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Users fetched successfully',
      data: user,
    });
  }
);
// @apiend point:api/v1/user/blocked
// @method:get
const getBlockedUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getBlockedUsers();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blocked Users fetched successfully',
      data: users,
    });
  }
);

export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  totalUsers,
  searchUsers,
  filterUsers,
  getAllUserProfile,
  blockUser,
  unblockUser,
  getBlockedUsers,
};
