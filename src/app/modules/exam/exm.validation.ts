import { z } from 'zod';

export const createExamValidationSchema = z.object({
  body: z.object({
    userId: z.string().nonempty(),
    step: z.number().int().min(1).max(3),
    score: z.number().min(0).max(100),
    certificationLevel: z.string().nonempty(),
    completed: z.boolean(),
    startedAt: z.string().optional(),
    finishedAt: z.string().optional(),
  }),
});

export const updateExamValidationSchema = z.object({
  body: z.object({
    score: z.number().min(0).max(100).optional(),
    certificationLevel: z.string().optional(),
    completed: z.boolean().optional(),
    finishedAt: z.string().optional(),
  }),
});

export const examValidation = {
  createExamValidationSchema,
  updateExamValidationSchema,
};
