import { Request, Response } from 'express';
import * as CoachingService from './coaching.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// Create
export const createUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CoachingService.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'User created successfully',
      data: result,
    });
  }
);

// Read All
export const getAllUsersController = catchAsync(
  async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const result = await CoachingService.getAllUsers(search);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Users fetched successfully',
      data: result,
    });
  }
);

// Read One
export const getUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CoachingService.getUserById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User fetched successfully',
      data: result,
    });
  }
);

// Update
export const updateUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CoachingService.updateUser(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User updated successfully',
      data: result,
    });
  }
);

// Delete
export const deleteUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CoachingService.deleteUser(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User deleted successfully',
      data: result,
    });
  }
);

// Approve/Deny Slot
export const updateSlotStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const { date, slotRange, action } = req.body;
    const result = await CoachingService.updateSlotStatus(
      req.params.id,
      date,
      slotRange,
      action
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Slot ${action.toLowerCase()} successfully`,
      data: result,
    });
  }
);
