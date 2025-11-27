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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true,
    }, // or ObjectId if linked to Users
    businessName: { type: String, required: true },
    businessType: { type: String, required: true },
    mission: { type: String, required: true },
    vision: { type: String, required: true },
    quizAnswers: [
      {
        question: { type: String, required: true },
        selectedAnswer: { type: String, required: true },
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
