import {
  AssessmentCategoryModel,
  QuizQuestionModel,
} from './success.path.model';
import { IAssessment, IQuizQuestion } from './success.path.interface';

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

/**
 * @ Assessment section business plan.
 */

// Add new assessment to a category
// ✅ Create
const addAssessment = async (categoryName: string, assessment: IAssessment) => {
  let category = await AssessmentCategoryModel.findOne({
    category: categoryName,
  });

  if (!category) {
    category = new AssessmentCategoryModel({
      category: categoryName,
      assessment: [assessment],
    });
  } else {
    category.assessment.push(assessment);
  }

  await category.save();
  return category;
};

// ✅ Read all
const getAllAssessmentCategories = async () => {
  return AssessmentCategoryModel.find();
};

// ✅ Read one category
const getAssessmentCategoryByName = async (categoryName: string) => {
  return AssessmentCategoryModel.findOne({ category: categoryName });
};

// ✅ Update specific assessment inside a category
const updateAssessment = async (
  categoryName: string,
  assessmentId: string,
  updatedData: Partial<IAssessment>
) => {
  const category = await AssessmentCategoryModel.findOne({
    category: categoryName,
  });
  if (!category) return null;

  const assessment = category.assessment.id(assessmentId);
  if (!assessment) return null;

  Object.assign(assessment, updatedData);
  await category.save();
  return assessment;
};

// ✅ Delete specific assessment inside a category
const deleteAssessment = async (categoryName: string, assessmentId: string) => {
  const category = await AssessmentCategoryModel.findOne({
    category: categoryName,
  });
  if (!category) return null;

  const assessment = category.assessment.id(assessmentId);
  if (!assessment) return null;

  assessment.deleteOne(); // remove from array
  await category.save();
  return assessment;
};

// ✅ Export in required format
export const SuccessPathService = {
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
};
