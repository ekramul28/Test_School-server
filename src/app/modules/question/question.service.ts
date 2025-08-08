/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Question } from './question.model';
import { TQuestion } from './question.interface';
import { QuestionSearchableFields } from './question.constant';

const createQuestion = async (payload: TQuestion) => {
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
