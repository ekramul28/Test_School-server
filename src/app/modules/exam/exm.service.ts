/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Exam } from './exm.model';
import { TExam } from './exm.interface';

const createExamInDB = async (payload: TExam) => {
  const exam = new Exam(payload);
  return await exam.save();
};

const getExamByUserAndStepFromDB = async (userId: string, step: number) => {
  const exam = await Exam.findOne({ userId, step });
  return exam;
};

const updateExamInDB = async (id: string, payload: Partial<TExam>) => {
  const updatedExam = await Exam.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedExam;
};

const getExamsByUserFromDB = async (userId: string) => {
  const exams = await Exam.find({ userId }).sort({ step: 1 });
  return exams;
};

const deleteExamInDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedExam = await Exam.findByIdAndDelete(id, { session });

    if (!deletedExam) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete exam');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedExam;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const ExamService = {
  createExamInDB,
  getExamByUserAndStepFromDB,
  updateExamInDB,
  getExamsByUserFromDB,
  deleteExamInDB,
};
