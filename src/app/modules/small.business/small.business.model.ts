import mongoose, { Schema, Model } from 'mongoose';
import {
  IAnswer,
  IAssessment,
  ICategory,
  IQuestion,
} from './small.business.interface';
// Answer schema
const AnswerSchema = new Schema<IAnswer>({
  text: { type: String, required: true },
  score: { type: Number, required: true },
});

// Question schema
const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  answers: {
    type: [AnswerSchema],
    validate: [
      (val: any[]) => val.length === 3,
      'Each question must have exactly 3 answers.',
    ],
  },
});

// @assesment schema.
const AssessmentSchema = new Schema<IAssessment>(
  {
    range: { type: String, required: true },
    description: { type: String, required: true },
    recommendedService: { type: String },
  },
  { timestamps: true }
);

// Category schema
const CategorySchema = new Schema<ICategory>({
  category: { type: String, required: true, unique: true },
  questions: [QuestionSchema],
});

// Model
export const CategoryModel: Model<ICategory> = mongoose.model<ICategory>(
  'Small_Business_Quiz',
  CategorySchema
);
export const AssessmentModel = mongoose.model<IAssessment>(
  'Samll_Business_Assessment',
  AssessmentSchema
);
