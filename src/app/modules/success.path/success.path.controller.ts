import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { SuccessPathService } from './success.path.service';
import { IAssessment, IQuizQuestion } from './success.path.interface';

// ✅ Add quiz question
const addQuizQuestion = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// ✅ Get all categories with questions
const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('Quiz');
    const result = await SuccessPathService.getAllCategories();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Categories retrieved successfully!!',
      data: result,
    });
  }
);

// ✅ Get one category with questions
const getCategoryByName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryName } = req.params;
    const result = await SuccessPathService.getCategoryByName(categoryName);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category retrieved successfully',
      data: result,
    });
  }
);

// ✅ Update quiz question
const updateQuizQuestion = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// ✅ Delete quiz question
const deleteQuizQuestion = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

/**
 * Assessment .
 */

// ✅ Create
export const addAssessment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryName } = req.params;
    const assessment: IAssessment = req.body;

    const result = await SuccessPathService.addAssessment(
      categoryName,
      assessment
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Assessment added successfully',
      data: result,
    });
  }
);

// ✅ Read all
export const getAllAssessmentCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SuccessPathService.getAllAssessmentCategories();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Categories fetched successfully',
      data: result,
    });
  }
);

// ✅ Read one category
export const getAssessmentCategoryByName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryName } = req.params;
    const result = await SuccessPathService.getAssessmentCategoryByName(
      categoryName
    );

    sendResponse(res, {
      success: true,
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: result ? 'Category fetched successfully' : 'Category not found',
      data: result,
    });
  }
);

// ✅ Update assessment
export const updateAssessment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryName, assessmentId } = req.params;
    const updatedData: Partial<IAssessment> = req.body;

    const result = await SuccessPathService.updateAssessment(
      categoryName,
      assessmentId,
      updatedData
    );

    sendResponse(res, {
      success: true,
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: result
        ? 'Assessment updated successfully'
        : 'Assessment not found',
      data: result,
    });
  }
);

// ✅ Delete assessment
export const deleteAssessment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryName, assessmentId } = req.params;

    const result = await SuccessPathService.deleteAssessment(
      categoryName,
      assessmentId
    );

    sendResponse(res, {
      success: true,
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: result
        ? 'Assessment deleted successfully'
        : 'Assessment not found',
      data: result,
    });
  }
);

//---------get assessment --------

const getAssessmentByRangeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { value } = req.query; // e.g. ?value=11
    const { categoryName } = req.params; // categoryId

    if (!value) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Query param "value" is required',
      });
    }

    const assessment = await SuccessPathService.getAssessmentByRange(
      categoryName,
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

export const SuccessPathController = {
  addQuizQuestion,
  getAllCategories,
  getCategoryByName,
  updateQuizQuestion,
  deleteQuizQuestion,
  addAssessment,
  getAllAssessmentCategories,
  getAssessmentCategoryByName,
  updateAssessment,
  deleteAssessment,
  getAssessmentByRangeController,
};
