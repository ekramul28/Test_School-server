/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Question } from './question.model';
import { TQuestion } from './question.interface';
import { QuestionSearchableFields } from './question.constant';

const STEP_LEVELS = {
  1: ['A1', 'A2'],
  2: ['B1', 'B2'],
  3: ['C1', 'C2'],
};

const createQuestion = async (payload: TQuestion) => {
  const { level, competency } = payload;

  // 1. Check total number of questions (max 132)
  const totalCount = await Question.countDocuments();
  if (totalCount >= 132) {
    throw new Error('Cannot create more than 132 total questions.');
  }

  // 2. Check for duplicate competency-level pair
  const existingSame = await Question.findOne({ level, competency });
  if (existingSame) {
    throw new Error(
      `Question for competency '${competency}' at level '${level}' already exists.`,
    );
  }

  // 3. Check if the level belongs to a valid step
  const step = Object.entries(STEP_LEVELS).find(([, levels]) =>
    levels.includes(level),
  );
  if (!step) {
    throw new Error(`Invalid level: ${level}.`);
  }

  // 4. Check number of questions in that step (max 44)
  const levelsInStep = step[1];
  const countForStep = await Question.countDocuments({
    level: { $in: levelsInStep },
  });

  if (countForStep >= 44) {
    throw new Error(`Step ${step[0]} already has 44 questions.`);
  }

  // ✅ Passed all validations → Create the question
  const result = await Question.create(payload);
  return result;
};

const getAllQuestions = async (query: Record<string, unknown>) => {
  const questionQuery = new QueryBuilder(Question.find(), query)
    .search(QuestionSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await questionQuery.modelQuery;
  const meta = await questionQuery.countTotal();

  return {
    data: result,
    meta,
  };
};

const getSingleQuestion = async (id: string) => {
  const result = await Question.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
  }
  return result;
};

const updateQuestion = async (id: string, payload: Partial<TQuestion>) => {
  const result = await Question.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
  }

  return result;
};

const deleteQuestion = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deleted = await Question.findByIdAndDelete(id, { session });

    if (!deleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete question');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleted;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err.message || 'Failed to delete question');
  }
};

export const QuestionService = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
