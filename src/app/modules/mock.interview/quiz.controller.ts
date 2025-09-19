import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { MockInterviewService } from './quiz.service';

const createQuiz = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await MockInterviewService.createQuizToDB(req.body);
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
  const result = await MockInterviewService.getQuizFromDB();
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
    const result = await MockInterviewService.updateQuizToDB(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await MockInterviewService.deleteQuizFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Quiz deleted successfully',
    data: result,
  });
});

//--------Assessment ---------
const createAssessment = catchAsync(async (req: Request, res: Response) => {
  const result = await MockInterviewService.createAssessment(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Assessment created successfully',
    data: result,
  });
});

const getAllAssessments = catchAsync(async (req: Request, res: Response) => {
  const result = await MockInterviewService.getAllAssessments();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Assessments fetched successfully',
    data: result,
  });
});

const getAssessmentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MockInterviewService.getAssessmentById(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Assessment fetched successfully',
    data: result,
  });
});

const updateAssessment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MockInterviewService.updateAssessment(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Assessment updated successfully',
    data: result,
  });
});

const deleteAssessment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MockInterviewService.deleteAssessment(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Assessment deleted successfully',
    data: result,
  });
});

//--------Get Assessment base on the range-----
const getAssessmentByRangeMockInterview = async (
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

    const assessment = await MockInterviewService.getAssessmentByRange(
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

export const MockInterviewController = {
  createQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz,
  //-----------Assessment------
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAssessmentByRangeMockInterview,
};
