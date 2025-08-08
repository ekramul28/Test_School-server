import { z } from 'zod';

export const createCertificateValidation = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    examStep: z
      .number()
      .int()
      .min(1)
      .max(3, 'Exam step must be between 1 and 3'),
    certificationLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  }),
});
