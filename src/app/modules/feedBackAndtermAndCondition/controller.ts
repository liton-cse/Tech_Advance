import { Request, Response } from 'express';
import {
  createFeedbackService,
  createOrUpdateTermsService,
  deleteFeedbackService,
  getFeedbacksService,
  getTermsService,
} from './service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';

const createFeedback = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const data = {
    ...req.body,
    userId,
  };
  const feedback = await createFeedbackService(data);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'FeedBack created successfully',
    data: feedback,
  });
});

const getFeedbacks = catchAsync(async (req: Request, res: Response) => {
  const feedbacks = await getFeedbacksService(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Feedback fetch successfully',
    data: feedbacks,
  });
});

const deleteFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  const feedback = await deleteFeedbackService(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: feedback ? 'Feedback deleted successfully' : 'Feedback not found',
    data: feedback,
  });
};

const getTerms = async (_req: Request, res: Response) => {
  const terms = await getTermsService();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: terms ? 'Terms And Condition Fetch successfully' : 'Not found',
    data: terms,
  });
};

const createOrUpdateTerms = async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: 'Content cannot be empty' });
  }

  const terms = await createOrUpdateTermsService(content);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: terms ? 'Terms created/updated successfully' : 'Not found',
    data: terms,
  });
};

export const FeedBackAndTermsAndCondition = {
  createFeedback,
  getFeedbacks,
  deleteFeedback,
  getTerms,
  createOrUpdateTerms,
};
