import { z } from 'zod';

const scoreSchema = z.object({
  correctAnswers: z.number().min(0),
  totalQuestions: z.number().min(0),
});

export const createExamValidationSchema = z.object({
  body: z.object({
    user: z.string().nonempty(),
    step: z.number().int().min(1).max(3),
    score: scoreSchema,
    certificationLevel: z.string().nonempty(),
    completed: z.boolean(),
    startedAt: z.string().optional(),
    finishedAt: z.string().optional(),
  }),
});

export const updateExamValidationSchema = z.object({
  body: z.object({
    score: scoreSchema.optional(),
    certificationLevel: z.string().optional(),
    completed: z.boolean().optional(),
    finishedAt: z.string().optional(),
  }),
});

export const examValidation = {
  createExamValidationSchema,
  updateExamValidationSchema,
};
