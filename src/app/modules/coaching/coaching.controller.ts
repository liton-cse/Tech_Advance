import { NextFunction, Request, Response } from 'express';
import { CoachingService } from './coaching.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import mongoose from 'mongoose';

// Create
// @apiend point:api/v1/coaching
// @method:POST
const createUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CoachingService.createCoachingUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'User created successfully',
      data: result,
    });
  }
);

// Read All search..
// @apiend point:api/v1/coaching/search?q=
// @method:get
const getAllUsersSearchController = catchAsync(
  async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      throw new ApiError(400, 'Search term (q) is required');
    }
    const result = await CoachingService.getAllCoachingUsers(q);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Users fetched successfully',
      data: result,
    });
  }
);

// Read all coaching
// @apiend point:api/v1/coaching
// @method:get
const getUsersController = catchAsync(async (req: Request, res: Response) => {
  const result = await CoachingService.getUser();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User fetched successfully',
    data: result,
  });
});

// Update
// @apiend point:api/v1/coaching/:id
// @method:put
const updateUserController = catchAsync(async (req: Request, res: Response) => {
  const result = await CoachingService.updateCoachingUser(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User updated successfully',
    data: result,
  });
});

// @apiend point:api/v1/coaching/:id
// @method:delete
const deleteUserController = catchAsync(async (req: Request, res: Response) => {
  const result = await CoachingService.deleteCoachingUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User deleted successfully',
    data: result,
  });
});

// Approve/Deny Slot
// @apiend point:api/v1/coaching/status/:id.
// @method:put
const updateSlotStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const { range, action } = req.body;
    let { id } = req.params;
    // 🔑 Sanitize the ID
    id = id.trim();

    // 🔑 Validate before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CoachingUser ID',
      });
    }
    const result = await CoachingService.updateSlotStatus(id, range, action);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Slot ${action.toLowerCase()} successfully`,
      data: result,
    });
  }
);

export const CoachingControllers = {
  createUserController,
  getAllUsersSearchController,
  getUsersController,
  updateUserController,
  deleteUserController,
  updateSlotStatusController,
};
