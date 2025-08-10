/* eslint-disable no-unused-vars */
import { Document, Model, Types } from 'mongoose';

export interface TExamScore {
  totalQuestions: number;
  correctAnswers: number;
}

export interface TExam extends Document {
  user: Types.ObjectId;
  step: 1 | 2 | 3;
  certificationLevel: 'Fail' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

  score: TExamScore;
  completedAt?: Date | null;
  isRetakeAllowed: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExamModel extends Model<TExam> {
  isExamExists(userId: string, step: number): Promise<TExam | null>;
}
