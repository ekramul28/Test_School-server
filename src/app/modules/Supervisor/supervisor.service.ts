import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { supervisorSearchableFields } from './supervisor.constant';
import { TSupervisor } from './supervisor.interface';
import { Supervisor } from './supervisor.model';

const getAllSupervisorsFromDB = async (query: Record<string, unknown>) => {
  const supervisorQuery = new QueryBuilder(
    Supervisor.find().populate('user').populate('assignedDepartment'),
    query,
  )
    .search(supervisorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await supervisorQuery.countTotal();
  const result = await supervisorQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleSupervisorFromDB = async (id: string) => {
  const result = await Supervisor.findById(id)
    .populate('assignedDepartment')
    .populate('user');
  return result;
};

const updateSupervisorIntoDB = async (
  id: string,
  payload: Partial<TSupervisor>,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { name, user, ...remainingData } = payload;

    const updatedData: Record<string, unknown> = { ...remainingData };

    if (name && Object.keys(name).length > 0) {
      for (const [key, value] of Object.entries(name)) {
        updatedData[`name.${key}`] = value;
      }
    }

    const existingSupervisor = await Supervisor.findById(id).session(session);
    if (!existingSupervisor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Supervisor not found');
    }

    const updatedSupervisor = await Supervisor.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true, session },
    );

    if (user && Object.keys(user).length > 0) {
      await User.findByIdAndUpdate(existingSupervisor.user, user, {
        new: true,
        runValidators: true,
        session,
      });
    }

    await session.commitTransaction();
    return updatedSupervisor;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const deleteSupervisorFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedSupervisor = await Supervisor.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedSupervisor) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete supervisor');
    }

    const userId = deletedSupervisor.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedSupervisor;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete supervisor');
  }
};

export const SupervisorServices = {
  getAllSupervisorsFromDB,
  getSingleSupervisorFromDB,
  updateSupervisorIntoDB,
  deleteSupervisorFromDB,
};
