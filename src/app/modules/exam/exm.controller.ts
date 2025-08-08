import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ExamService } from './exm.service';

const createExam = catchAsync(async (req, res) => {
  const examData = req.body;
  const result = await ExamService.createExamInDB(examData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Exam created successfully',
    data: result,
  });
});

const getExamByUserAndStep = catchAsync(async (req, res) => {
  const { userId, step } = req.params;
  const result = await ExamService.getExamByUserAndStepFromDB(
    userId,
    Number(step),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exam retrieved successfully',
    data: result,
  });
});

const updateExam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const examData = req.body;
  const result = await ExamService.updateExamInDB(id, examData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exam updated successfully',
    data: result,
  });
});

const getExamsByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await ExamService.getExamsByUserFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exams retrieved successfully',
    data: result,
  });
});

const deleteExam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ExamService.deleteExamInDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exam deleted successfully',
    data: result,
  });
});

export const ExamControllers = {
  createExam,
  getExamByUserAndStep,
  updateExam,
  getExamsByUser,
  deleteExam,
};
