import mongoose, { model, Schema } from 'mongoose';
import type { IAnswer, IAssessment, IQuiz, QuizModal } from './quiz.interface';

const quizSchema = new Schema<IQuiz, QuizModal>(
  {
    question: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    answers: [
      {
        text: { type: String, required: true },
        score: { type: Number, required: true },
      },
      { _id: false },
    ],
  },
  { timestamps: true }
);

const assessmentShema = new Schema<IAssessment>(
  {
    range: { type: String, required: true },
    recomandedText: { type: String, required: true },
  },
  { timestamps: true }
);

//exist user check
quizSchema.statics.isExistQuizById = async (id: string) => {
  const isExist = await QuizModel.findById(id);
  return isExist;
};

export const AssessmentModel = mongoose.model<IAssessment>(
  'mock-Interview-assessment',
  assessmentShema
);

export const QuizModel = model<IQuiz, QuizModal>(
  'mock-interview-quiz',
  quizSchema
);
