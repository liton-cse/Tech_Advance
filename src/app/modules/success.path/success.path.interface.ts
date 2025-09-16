import { Document, Types } from 'mongoose';
export interface IQuizQuestion extends Document {
  questionText: string;
  answers: string[];
}

export interface ICategory extends Document {
  category: string;
  questions: Types.DocumentArray<IQuizQuestion>;
}
