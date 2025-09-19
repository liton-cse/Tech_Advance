import mongoose, { Schema } from 'mongoose';
import {
  IAnswer,
  IQuestion,
  IQuiz,
  IUserResponse,
} from './business.plan.interface';

export const AnswerSchema = new Schema<IAnswer>({
  answer: { type: String, required: true },
  _id: false,
});

const QuizSchema = new Schema<IQuiz>(
  {
    questionText: { type: String, required: true },
    answers: {
      type: [AnswerSchema],
    },
  },
  { timestamps: true }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

//User response for generating pdf...

const UserResponseSchema = new Schema<IUserResponse>(
  {
    userId: { type: String, required: true }, // or ObjectId if linked to Users
    quizAnswers: [
      {
        question: { type: String, required: true },
        selectedAnswer: { type: String, required: true },
      },
    ],
    writtenAnswers: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const UserResponseModel = mongoose.model<IUserResponse>(
  'Business plan pdf',
  UserResponseSchema
);

export const QuizModel = mongoose.model<IQuiz>(
  'Business Plan Quiz',
  QuizSchema
);

export const QuestionModel = mongoose.model<IQuestion>(
  'Business Plan Question',
  QuestionSchema
);
