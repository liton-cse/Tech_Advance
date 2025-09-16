import { Document, Types } from 'mongoose';
// Interfaces
export interface IAnswer extends Document {
  text: string;
  score: number;
}

export interface IQuestion extends Document {
  questionText: string;
  answers: IAnswer[];
}

export interface ICategory extends Document {
  category: string;
  questions: Types.DocumentArray<IQuestion>;
}

export interface IAssessment extends Document {
  range: string;
  description: string;
  recommendedService?: string;
}
