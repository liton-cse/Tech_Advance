import { z } from 'zod';

const createQuizZodSchema = z.object({
  question: z.string({ required_error: 'Question is required' }),
  answers: z
    .array(
      z.object({
        text: z.string({ required_error: 'Answer text is required' }),
        score: z
          .number({ required_error: 'Score is required' })
          .min(0, 'Score must be a positive number'),
      })
    )
    .min(2, 'At least 2 answers are required')
    .max(5, 'At most 5 answers are allowed'),
});

export const updateQuizZodSchema = z.object({
  body: z.object({
    question: z.string().optional(),
    answers: z
      .array(
        z.object({
          text: z.string().optional(),
          score: z.number().min(0).optional(),
        })
      )
      .optional(),
  }),
});

export const QuizValidation = { createQuizZodSchema, updateQuizZodSchema };
