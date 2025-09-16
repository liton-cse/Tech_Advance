// controllers/userController.js

import { Response, Request, NextFunction } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DashboardService } from './dashboard.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// @get monthly applicant rate
// @apiend point:api/v1/dashboard
// @method:get
const getMonthlyApplicantChart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await DashboardService.getMonthlyApplicants();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Data fetch successfully`,
      data: data,
    });
  }
);

export const DashboardController = { getMonthlyApplicantChart };
