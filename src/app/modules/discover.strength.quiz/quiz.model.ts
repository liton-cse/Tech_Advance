import { model, Schema } from 'mongoose';
import type { IQuiz, QuizModal } from './quiz.interface';

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

//exist user check
quizSchema.statics.isExistQuizById = async (id: string) => {
  const isExist = await Quiz.findById(id);
  return isExist;
};

export const Quiz = model<IQuiz, QuizModal>('Quiz', quizSchema);
