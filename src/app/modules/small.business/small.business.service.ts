import { AssessmentModel, CategoryModel } from './small.business.model';
import { IQuestion, ICategory, IAssessment } from './small.business.interface';

// Add a question to a category
const addQuestion = async (
  categoryName: string,
  question: IQuestion
): Promise<ICategory | null> => {
  let category = await CategoryModel.findOne({ category: categoryName });

  if (!category) {
    category = new CategoryModel({
      category: categoryName,
      questions: [question],
    });
  } else {
    category.questions.push(question);
  }

  await category.save();
  return category;
};

// Get all questions of a category
const getQuestionsByCategory = async (
  categoryName: string
): Promise<IQuestion[] | null> => {
  const category = await CategoryModel.findOne({ category: categoryName });
  return category ? category.questions : null;
};

// Get a single question by ID
const getQuestionById = async (
  categoryName: string,
  questionId: string
): Promise<IQuestion | null> => {
  const category = await CategoryModel.findOne({ category: categoryName });
  if (!category) return null;
  return category.questions.id(questionId) || null;
};

// Update a question
const updateQuestion = async (
  categoryName: string,
  questionId: string,
  updatedQuestion: Partial<IQuestion>
): Promise<ICategory | null> => {
  return CategoryModel.findOneAndUpdate(
    { category: categoryName, 'questions._id': questionId },
    { $set: { 'questions.$': updatedQuestion } },
    { new: true }
  );
};

// Delete a question
const deleteQuestion = async (
  categoryName: string,
  questionId: string
): Promise<ICategory | null> => {
  return CategoryModel.findOneAndUpdate(
    { category: categoryName },
    { $pull: { questions: { _id: questionId } } },
    { new: true }
  );
};

// @Assesment database functionality...
const createAssessment = async (
  assessment: IAssessment
): Promise<IAssessment> => {
  const result = await AssessmentModel.create(assessment);
  return result;
};

const getAllAssessments = async (): Promise<IAssessment[]> => {
  const result = await AssessmentModel.find();
  return result;
};

const getAssessmentById = async (id: string): Promise<IAssessment | null> => {
  const result = await AssessmentModel.findById(id);
  return result;
};

const updateAssessment = async (
  id: string,
  payload: Partial<IAssessment>
): Promise<IAssessment | null> => {
  const result = await AssessmentModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteAssessment = async (id: string): Promise<IAssessment | null> => {
  const result = await AssessmentModel.findByIdAndDelete(id);
  return result;
};

//---------- Get Assessment by Range-----
const getAssessmentByRange = async (
  value: number
): Promise<IAssessment | null> => {
  // Assuming range is stored like "10-20"
  const assessments = await AssessmentModel.find();

  for (const assessment of assessments) {
    const [min, max] = assessment.range.split('-').map(Number);

    if (value >= min && value <= max) {
      return assessment;
    }
  }

  return null;
};

export const AssessmentService = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAssessmentByRange,
};

// Export all service functions in a single object
export const SamllBusinessService = {
  addQuestion,
  getQuestionsByCategory,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
