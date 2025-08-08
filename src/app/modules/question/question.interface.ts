import { Model, Types } from 'mongoose';

export type TQuestionLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type TQuestion = {
  _id?: Types.ObjectId;
  questionText: string;
  options: string[];
  correctAnswer: string;
  level: TQuestionLevel;
  competency: string; // e.g., 'Digital Communication', 'Problem Solving', etc.
  durationInSeconds?: number; // Optional: If you want custom time per question
  isDeleted?: boolean;
};

export type QuestionModel = Model<TQuestion, Record<string, unknown>>;
