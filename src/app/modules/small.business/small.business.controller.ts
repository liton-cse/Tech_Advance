import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import {
  AssessmentService,
  SamllBusinessService,
} from './small.business.service';
import { IAssessment } from './small.business.interface';

// Add a question
const addQuestion = catchAsync(async (req: Request, res: Response) => {
  const { categoryName } = req.params;
  const question = req.body;
  const result = await SamllBusinessService.addQuestion(categoryName, question);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Question added successfully',
    data: result,
  });
});

// Get all questions by category
const getQuestionsByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryName } = req.params;

    const result = await SamllBusinessService.getQuestionsByCategory(
      categoryName
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Questions retrieved successfully',
      data: result,
    });
  }
);

// Get a question by ID
const getQuestionById = catchAsync(async (req: Request, res: Response) => {
  const { categoryName, questionId } = req.params;
  const result = await SamllBusinessService.getQuestionById(
    categoryName,
    questionId
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Question retrieved successfully',
    data: result,
  });
});

// Update a question
const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const { categoryName, questionId } = req.params;
  const updatedQuestion = req.body;
  const result = await SamllBusinessService.updateQuestion(
    categoryName,
    questionId,
    updatedQuestion
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Question updated successfully',
    data: result,
  });
});

// Delete a question
const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const { categoryName, questionId } = req.params;
  const result = await SamllBusinessService.deleteQuestion(
    categoryName,
    questionId
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Question deleted successfully',
    data: result,
  });
});

// @Assesment controller logic.
const createAssessment = catchAsync(async (req: Request, res: Response) => {
  const payload: IAssessment = req.body;
  const result = await AssessmentService.createAssessment(payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Assessment created successfully',
    data: result,
  });
});

const getAllAssessments = catchAsync(async (req: Request, res: Response) => {
  const result = await AssessmentService.getAllAssessments();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Assessments retrieved successfully',
    data: result,
  });
});

const getAssessmentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AssessmentService.getAssessmentById(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Assessment retrieved successfully',
    data: result,
  });
});

const updateAssessment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload: Partial<IAssessment> = req.body;
  const result = await AssessmentService.updateAssessment(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Assessment updated successfully',
    data: result,
  });
});

const deleteAssessment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AssessmentService.deleteAssessment(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Assessment deleted successfully',
    data: result,
  });
});

//--------Get Assessment base on the range-----
const getAssessmentByRangeSmallBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { value } = req.query; // e.g. ?value=11
    if (!value) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Query param "value" is required',
      });
    }

    const assessment = await AssessmentService.getAssessmentByRange(
      Number(value)
    );

    sendResponse(res, {
      success: !!assessment,
      statusCode: assessment ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: assessment
        ? 'Assessment retrieved successfully'
        : 'No assessment found for this value',
      data: assessment,
    });
  } catch (err) {
    next(err);
  }
};

export const AssessmentController = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAssessmentByRangeSmallBusiness,
};

// Export all controllers in a single object
export const SamllBusinessController = {
  addQuestion,
  getQuestionsByCategory,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
