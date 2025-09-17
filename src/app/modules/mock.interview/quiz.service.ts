import { IQuiz } from './quiz.interface';
import { QuizModel, AssessmentModel } from './quiz.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { IAssessment } from './quiz.interface';

const createQuizToDB = async (payload: Partial<IQuiz>): Promise<IQuiz> => {
  const createQuiz = await QuizModel.create(payload);
  if (!createQuiz) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Quiz');
  }
  return createQuiz;
};

const getQuizFromDB = async (): Promise<IQuiz[]> => {
  const quizzes = await QuizModel.find();

  if (quizzes.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No quizzes found!');
  }

  return quizzes;
};

const updateQuizToDB = async (
  id: string,
  payload: Partial<IQuiz>
): Promise<Partial<IQuiz | null>> => {
  const isExisQuiz = await QuizModel.isExistQuizById(id);
  if (!isExisQuiz) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Quiz doesn't exist!");
  }
  const updateDoc = await QuizModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const deleteQuizFromDB = async (id: string): Promise<IQuiz | null> => {
  const isExistQuiz = await QuizModel.isExistQuizById(id);

  if (!isExistQuiz) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Quiz doesn't exist!");
  }

  const deletedQuiz = await QuizModel.findByIdAndDelete(id);

  if (!deletedQuiz) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete quiz!'
    );
  }

  return deletedQuiz;
};

//--------- Assessment--------

// assessment.service.ts

const createAssessment = async (payload: IAssessment) => {
  const result = await AssessmentModel.create(payload);
  return result;
};

const getAllAssessments = async () => {
  return await AssessmentModel.find();
};

const getAssessmentById = async (id: string) => {
  return await AssessmentModel.findById(id);
};

const updateAssessment = async (id: string, payload: Partial<IAssessment>) => {
  return await AssessmentModel.findByIdAndUpdate(id, payload, { new: true });
};

const deleteAssessment = async (id: string) => {
  return await AssessmentModel.findByIdAndDelete(id);
};

export const MockInterviewService = {
  createQuizToDB,
  getQuizFromDB,
  updateQuizToDB,
  deleteQuizFromDB,
  //------Assessment------
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
};
