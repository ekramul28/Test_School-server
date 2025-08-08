/* eslint-disable no-unused-vars */
import { Document, Model, Types } from 'mongoose';

export interface TExamAnswer {
  questionId: Types.ObjectId;
  selectedOption: string;
  isCorrect: boolean;
}

export interface TExamScore {
  step: 1 | 2 | 3;
  scorePercentage: number;
  certificationLevel: 'Fail' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface TExam extends Document {
  user: Types.ObjectId;
  step: 1 | 2 | 3;
  answers: TExamAnswer[];
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
