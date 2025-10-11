import { NextFunction, Request, Response } from 'express';
import { CoachingService } from './coaching.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import mongoose from 'mongoose';
import { NotificationService } from '../notification/notification.service';

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

// Read All search..like name,pending,approved,denied.
// @apiend point:api/v1/coaching/search?q=
// @method:get
const getAllUsersSearchController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      throw new ApiError(400, 'Search term (q) is required');
    }
    const result = await CoachingService.getAllSearchCoachingUsers(q);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Users fetched successfully',
      data: result,
    });
  }
);

// Read all coaching user
// @apiend point:api/v1/coaching/users
// @method:get
const getUsersController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CoachingService.getUser();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Coaching user fetched successfully',
      data: result,
    });
  }
);

// Read coaching user by Id..
// @apiend point:api/v1/coaching/:id
// @method:get
const getUsersControllerById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CoachingService.getUserById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User fetched successfully',
      data: result,
    });
  }
);
// Update any coaching user
// @apiend point:api/v1/coaching/:id
// @method:put
const updateUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// @apiend point:api/v1/coaching/:id
// @method:delete
const deleteUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CoachingService.deleteCoachingUser(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User deleted successfully',
      data: result,
    });
  }
);

// Approve/Deny Slot
// @apiend point:api/v1/coaching/status/:id.
// @method:put
const updateSlotStatusController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { range, action } = req.body;
    let { id } = req.params;
    id = id.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CoachingUser ID',
      });
    }
    const result = await CoachingService.updateSlotStatus(id, range, action);
    const title =
      result.status == 'APPROVED'
        ? `${result?.name} is ${result?.status}`
        : `${result?.name} is ${result?.status}`;
    const description = `The User is ${result.status} by admin!`;
    await NotificationService.sendCustomNotification(title, description);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Slot ${action.toLowerCase()} successfully`,
      data: result,
    });
  }
);

// @API Endpoint: api/v1/coaching/total-user
// @Method: GET
const totalCoachingUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const count = await CoachingService.getTotalCoachingUsers();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Total user are ${count}`,
      data: count,
    });
  }
);
// @API Endpoint: api/v1/coaching/approved/total-user
// @Method: GET
const totalApprovedCoachingUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const count = await CoachingService.getTotalApprovedCoachingUsers();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Total user are ${count}`,
      data: count,
    });
  }
);

// @API Endpoint: api/v1/coaching/approved/total-user
// @Method: GET
const totalDeniedCoachingUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const count = await CoachingService.getTotalDeniedCoachingUsers();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Total user are ${count}`,
      data: count,
    });
  }
);

//---------Caoch Section---------
// Create coach
export const createCoach = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    const coach = await CoachingService.createCoach(name, description);

    const title = `${name} is added as new coach`;
    await NotificationService.sendCustomNotification(title, description);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Coach created successfully',
      data: coach,
    });
  }
);

// Update coach
export const updateCoach = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const coach = await CoachingService.updateCoach(req.params.id, req.body);

    sendResponse(res, {
      success: !!coach,
      statusCode: coach ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: coach ? 'Coach updated successfully' : 'Coach not found',
      data: coach ?? null,
    });
  }
);

// Delete coach
export const deleteCoach = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const coach = await CoachingService.deleteCoach(req.params.id);
    sendResponse(res, {
      success: !!coach,
      statusCode: coach ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: coach ? 'Coach deleted successfully' : 'Coach not found',
      data: coach,
    });
  }
);

// Get all coaches
export const getAllCoaches = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const coaches = await CoachingService.getAllCoaches();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'All coaches retrieved successfully',
      data: coaches,
    });
  }
);

// Get coach by ID
export const getCoachById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const coach = await CoachingService.getCoachById(req.params.id);
    sendResponse(res, {
      success: !!coach,
      statusCode: coach ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: coach ? 'Coach retrieved successfully' : 'Coach not found',
      data: coach ?? null,
    });
  }
);

// Add date (with default slots)
export const addDate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.body;
    console.log(date);
    const coach = await CoachingService.addDateWithDefaultSlots(
      req.params.id,
      date
    );
    console.log(coach);
    sendResponse(res, {
      success: !!coach,
      statusCode: coach ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: coach ? 'Date added successfully' : 'Coach not found',
      data: coach ?? null,
    });
  }
);

// Update slot
export const updateSlot = catchAsync(async (req: Request, res: Response) => {
  const { date, updates } = req.body;
  const coach = await CoachingService.updateSlot(req.params.id, date, updates);

  sendResponse(res, {
    success: !!coach,
    statusCode: coach ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: coach ? 'Slot updated successfully' : 'Coach or date not found',
    data: coach,
  });
});

export const deleteSlot = catchAsync(async (req, res) => {
  const { date, slotKey } = req.body; // { date: "18-09-2025", slotKey: "slot2" }
  const coach = await CoachingService.deleteSlot(req.params.id, date, slotKey);

  sendResponse(res, {
    success: !!coach,
    statusCode: coach ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: coach ? 'Slot deleted successfully' : 'Coach or slot not found',
    data: coach,
  });
});

// Get slots by date
// @route GET /api/v1/coaching/coach/:id/slots?date=18-09-2025
export const getSlotsByDate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.query as { date: string };
    const slots = await CoachingService.getSlotsByDate(req.params.id, date);
    sendResponse(res, {
      success: !!slots,
      statusCode: slots ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: slots
        ? 'Slots retrieved successfully'
        : 'Slots not found for this date',
      data: slots ?? null,
    });
  }
);
// toggle the flag...
const toggleSlotFlagController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, slotKey } = req.body;
      const { coachId } = req.params;

      if (!coachId || !date || !slotKey) {
        return res
          .status(400)
          .json({ error: 'coachId, date, and slotKey are required' });
      }

      const updatedCoach = await CoachingService.toggleSlotFlag(
        coachId,
        date,
        slotKey
      );

      sendResponse(res, {
        success: !!updatedCoach,
        statusCode: updatedCoach ? StatusCodes.OK : StatusCodes.NOT_FOUND,
        message: updatedCoach
          ? 'Slot Bock retrieved successfully'
          : 'Slots  not found for this date',
        data: updatedCoach ?? null,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

export const CoachingControllers = {
  createUserController,
  getAllUsersSearchController,
  getUsersController,
  updateUserController,
  deleteUserController,
  updateSlotStatusController,
  getUsersControllerById,
  totalCoachingUsers,
  totalApprovedCoachingUsers,
  totalDeniedCoachingUsers,
  //---Coach----
  createCoach,
  updateCoach,
  deleteCoach,
  getAllCoaches,
  getCoachById,
  addDate,
  updateSlot,
  deleteSlot,
  getSlotsByDate,
  toggleSlotFlagController,
};
