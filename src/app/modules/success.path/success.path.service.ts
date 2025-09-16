import { QuizQuestionModel } from './success.path.model';
import { IQuizQuestion } from './success.path.interface';

// Add question under a category
const addQuizQuestion = async (
  categoryName: string,
  question: IQuizQuestion
) => {
  let category = await QuizQuestionModel.findOne({ category: categoryName });

  if (!category) {
    category = new QuizQuestionModel({
      category: categoryName,
      questions: [question],
    });
  } else {
    category.questions.push(question);
  }

  await category.save();
  return category;
};

// Get all categories with their questions
const getAllCategories = async () => {
  return await QuizQuestionModel.find();
};

// Get one category with questions
const getCategoryByName = async (categoryName: string) => {
  return await QuizQuestionModel.findOne({ category: categoryName });
};

// Update a question inside a category
const updateQuizQuestion = async (
  categoryName: string,
  questionId: string,
  payload: Partial<IQuizQuestion>
) => {
  const category = await QuizQuestionModel.findOne({ category: categoryName });
  if (!category) return null;

  const question = category.questions.id(questionId);
  if (!question) return null;

  if (payload.questionText) question.questionText = payload.questionText;
  if (payload.answers) question.answers = payload.answers;

  await category.save();
  return category;
};

// Delete a question inside a category
const deleteQuizQuestion = async (categoryName: string, questionId: string) => {
  const category = await QuizQuestionModel.findOne({ category: categoryName });
  if (!category) return null;

  const question = category.questions.id(questionId);
  if (!question) return null;

  question.deleteOne();
  await category.save();

  return category;
};

export const SuccessPathService = {
  addQuizQuestion,
  getAllCategories,
  getCategoryByName,
  updateQuizQuestion,
  deleteQuizQuestion,
};
