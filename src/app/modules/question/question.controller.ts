import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { QuestionService } from './question.service';
import { TQuestion } from './question.interface';

const createQuestion = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await QuestionService.createQuestion(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Question created successfully',
    data: result,
  });
});

const getAllQuestions = catchAsync(async (req, res) => {
  const result = await QuestionService.getAllQuestions(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Questions retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await QuestionService.getSingleQuestion(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Question retrieved successfully',
    data: result,
  });
});

const updateQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await QuestionService.updateQuestion(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Question updated successfully',
    data: result,
  });
});

const deleteQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await QuestionService.deleteQuestion(id);

  sendResponse<TQuestion>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Question deleted successfully',
    data: result,
  });
});

export const QuestionController = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
