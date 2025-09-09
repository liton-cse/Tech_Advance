import { IQuiz } from './quiz.interface';
import { Quiz } from './quiz.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const createQuizToDB = async (payload: Partial<IQuiz>): Promise<IQuiz> => {
  const createQuiz = await Quiz.create(payload);
  if (!createQuiz) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Quiz');
  }
  return createQuiz;
};

const getQuizFromDB = async (): Promise<IQuiz[]> => {
  const quizzes = await Quiz.find();

  if (quizzes.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No quizzes found!');
  }

  return quizzes;
};

const updateQuizToDB = async (
  id: string,
  payload: Partial<IQuiz>
): Promise<Partial<IQuiz | null>> => {
  const isExisQuiz = await Quiz.isExistQuizById(id);
  if (!isExisQuiz) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Quiz doesn't exist!");
  }
  const updateDoc = await Quiz.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

export const deleteQuizFromDB = async (id: string): Promise<IQuiz | null> => {
  const isExistQuiz = await Quiz.isExistQuizById(id);

  if (!isExistQuiz) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Quiz doesn't exist!");
  }

  const deletedQuiz = await Quiz.findByIdAndDelete(id);

  if (!deletedQuiz) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete quiz!'
    );
  }

  return deletedQuiz;
};

export const QuizService = {
  createQuizToDB,
  getQuizFromDB,
  updateQuizToDB,
  deleteQuizFromDB,
};
