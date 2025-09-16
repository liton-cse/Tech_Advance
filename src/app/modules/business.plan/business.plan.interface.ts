import { Document } from 'mongoose';
export interface IAnswer extends Document {
  answer: { type: string };
}
export interface IQuiz extends Document {
  questionText: string;
  answers: IAnswer[];
}
export interface IQuestion {
  questionText: string;
  answer: string;
}
