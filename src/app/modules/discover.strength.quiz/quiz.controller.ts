import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { QuizService } from './quiz.service';
import { QuizValidation } from './quiz.validation';

const createQuiz = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await QuizService.createQuizToDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Quiz created successfully',
      data: result,
    });
  }
);

const getQuizzes = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await QuizService.getQuizFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateQuiz = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await QuizService.updateQuizToDB(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

export const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await QuizService.deleteQuizFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Quiz deleted successfully',
    data: result,
  });
});

export const QuizController = {
  createQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz,
};
