import { Document, Types } from 'mongoose';
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

// Pdf response ....
export interface IUserResponse extends Document {
  userId: Types.ObjectId;
  businessName: string;
  businessType: string;
  mission: string;
  vision: string;
  quizAnswers: { question: string; selectedAnswer: string }[];
}
