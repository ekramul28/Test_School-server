import { z } from 'zod';

// Define enums or string literals for levels and competencies
const QuestionLevel = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
const Competency = z.string().min(1, 'Competency is required');

export const createQuestionSchema = z.object({
  body: z.object({
    questionText: z.string().min(5, 'Title must be at least 5 characters'),
    options: z.array(z.string()).min(2, 'At least 2 options required'),
    correctAnswer: z.string(),
    level: QuestionLevel,
    competency: Competency,
  }),
});

export const updateQuestionSchema = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    options: z.array(z.string()).min(2).optional(),
    correctAnswer: z.string().optional(),
    level: QuestionLevel.optional(),
    competency: Competency.optional(),
    marks: z.number().min(1).max(100).optional(),
  }),
});

export const QuestionValidation = {
  createQuestionSchema,
  updateQuestionSchema,
};
