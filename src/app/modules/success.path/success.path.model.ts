import { Schema, model } from 'mongoose';
import { IQuizQuestion, ICategory } from './success.path.interface';

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  questionText: { type: String, required: true },
  answers: { type: [String], required: true, default: ['Yes', 'No'] },
});
const CategorySchema = new Schema<ICategory>({
  category: { type: String, required: true, unique: true },
  questions: [QuizQuestionSchema],
});

export const QuizQuestionModel = model<ICategory>(
  'SuccessPathQuizQuestion',
  CategorySchema
);
