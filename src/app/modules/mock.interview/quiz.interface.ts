import { Model } from 'mongoose';
export interface IAnswer {
  text: string;
  score: number;
}

export interface IQuiz {
  question: string;
  answers: IAnswer[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IAssessment extends Document {
  range: string;
  recomandedText: string;
}

export type QuizModal = {
  isExistQuizById(id: string): any;
} & Model<IQuiz>;
