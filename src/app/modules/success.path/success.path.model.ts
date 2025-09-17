import { Schema, model } from 'mongoose';
import {
  IQuizQuestion,
  ICategory,
  IAssessment,
  IAssessmentCategory,
} from './success.path.interface';

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  questionText: { type: String, required: true },
  answers: { type: [String], required: true, default: ['Yes', 'No'] },
});
const CategorySchema = new Schema<ICategory>({
  category: { type: String, required: true, unique: true },
  questions: [QuizQuestionSchema],
});

const AssessmentSchema = new Schema<IAssessment>({
  range: { type: String, required: true },
  begineerData: { type: String, required: true },
  IntermediateData: { type: String, required: true },
  proData: { type: String, required: true },
});

const AssessmentCategorySchema = new Schema<IAssessmentCategory>({
  category: { type: String, required: true, unique: true },
  assessment: [AssessmentSchema],
});

export const AssessmentCategoryModel = model<IAssessmentCategory>(
  'Success Path Assessment ',
  AssessmentCategorySchema
);

export const QuizQuestionModel = model<ICategory>(
  'SuccessPathQuizQuestion',
  CategorySchema
);
