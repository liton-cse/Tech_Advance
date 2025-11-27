import {
  QuestionModel,
  QuizModel,
  UserResponseModel,
} from './business.plan.model';
import { IQuestion, IQuiz, IUserResponse } from './business.plan.interface';

const createQuiz = async (payload: IQuiz): Promise<IQuiz> => {
  const result = await QuizModel.create(payload);
  return result;
};

const getAllQuizs = async (): Promise<IQuiz[]> => {
  const result = await QuizModel.find();
  return result;
};

const getQuizById = async (id: string): Promise<IQuiz | null> => {
  const result = await QuizModel.findById(id);
  return result;
};

const updateQuiz = async (
  id: string,
  payload: Partial<IQuiz>
): Promise<IQuiz | null> => {
  const result = await QuizModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteQuiz = async (id: string): Promise<IQuiz | null> => {
  const result = await QuizModel.findByIdAndDelete(id);
  return result;
};

//@Business Plan Question.
const addQuestion = async (question: IQuestion): Promise<IQuestion> => {
  const result = await QuestionModel.create(question);
  return result;
};

const getAllQuestions = async (): Promise<IQuestion[]> => {
  return await QuestionModel.find();
};

const getQuestionById = async (id: string): Promise<IQuestion | null> => {
  return await QuestionModel.findById(id);
};

const updateQuestion = async (
  id: string,
  payload: Partial<IQuestion>
): Promise<IQuestion | null> => {
  return await QuestionModel.findByIdAndUpdate(id, payload, { new: true });
};

const deleteQuestion = async (id: string): Promise<IQuestion | null> => {
  return await QuestionModel.findByIdAndDelete(id);
};

//Submitted data for generating pdf....
const submittedDataforPdf = async (
  bodyData: IUserResponse
): Promise<IUserResponse> => {
  try {
    // Save user responses
    console.log(bodyData);
    const response = await UserResponseModel.create(bodyData);
    return response;
  } catch (error) {
    throw new Error('Error saving responses: ' + error);
  }
};

export const UserResponseService = {
  submittedDataforPdf,
};

export const QuestionService = {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
export const QuizService = {
  createQuiz,
  getAllQuizs,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
