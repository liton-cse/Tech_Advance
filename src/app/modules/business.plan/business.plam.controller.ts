import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { IQuestion, IQuiz, IUserResponse } from './business.plan.interface';
import {
  QuestionService,
  QuizService,
  UserResponseService,
} from './business.plan.service';

const createQuiz = catchAsync(async (req: Request, res: Response) => {
  const payload: IQuiz = req.body;
  const result = await QuizService.createQuiz(payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Quiz created successfully',
    data: result,
  });
});

const getAllQuizs = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizService.getAllQuizs();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Quizs retrieved successfully',
    data: result,
  });
});

const getQuizById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuizService.getQuizById(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Quiz retrieved successfully',
    data: result,
  });
});

const updateQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload: Partial<IQuiz> = req.body;
  const result = await QuizService.updateQuiz(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Quiz updated successfully',
    data: result,
  });
});

const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuizService.deleteQuiz(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Quiz deleted successfully',
    data: result,
  });
});

//@business plan question controller.
const addQuestion = catchAsync(async (req: Request, res: Response) => {
  const question: IQuestion = req.body;
  const result = await QuestionService.addQuestion(question);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Question added successfully',
    data: result,
  });
});

const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.getAllQuestions();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Questions retrieved successfully',
    data: result,
  });
});

const getQuestionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuestionService.getQuestionById(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Question retrieved successfully',
    data: result,
  });
});

const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload: Partial<IQuestion> = req.body;
  const result = await QuestionService.updateQuestion(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Question updated successfully',
    data: result,
  });
});

const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuestionService.deleteQuestion(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Question deleted successfully',
    data: result,
  });
});

// Generating pdf base on the answer...

export const BusinessPlanPdf = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodyData = {
        ...req.body,
        userId: req.user.id,
      };
      const response = await UserResponseService.submittedDataforPdf(bodyData);
      console.log(bodyData);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Response Saved successfully',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const BusinessPlanController = {
  BusinessPlanPdf,
};

export const QuestionController = {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
export const QuizController = {
  createQuiz,
  getAllQuizs,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
