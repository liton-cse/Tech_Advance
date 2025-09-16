import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { SuccessPathService } from './success.path.service';
import { IQuizQuestion } from './success.path.interface';

// ✅ Add quiz question
const addQuizQuestion = catchAsync(async (req: Request, res: Response) => {
  const { categoryName } = req.params;
  const question: IQuizQuestion = req.body;

  const result = await SuccessPathService.addQuizQuestion(
    categoryName,
    question
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Quiz question added successfully',
    data: result,
  });
});

// ✅ Get all categories with questions
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await SuccessPathService.getAllCategories();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

// ✅ Get one category with questions
const getCategoryByName = catchAsync(async (req: Request, res: Response) => {
  const { categoryName } = req.params;
  const result = await SuccessPathService.getCategoryByName(categoryName);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successfully',
    data: result,
  });
});

// ✅ Update quiz question
const updateQuizQuestion = catchAsync(async (req: Request, res: Response) => {
  const { categoryName, questionId } = req.params;
  const payload = req.body;

  const result = await SuccessPathService.updateQuizQuestion(
    categoryName,
    questionId,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Quiz question updated successfully',
    data: result,
  });
});

// ✅ Delete quiz question
const deleteQuizQuestion = catchAsync(async (req: Request, res: Response) => {
  const { categoryName, questionId } = req.params;

  const result = await SuccessPathService.deleteQuizQuestion(
    categoryName,
    questionId
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Quiz question deleted successfully',
    data: result,
  });
});

export const SuccessPathController = {
  addQuizQuestion,
  getAllCategories,
  getCategoryByName,
  updateQuizQuestion,
  deleteQuizQuestion,
};
