import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SupervisorServices } from './supervisor.service';

const getSingleSupervisor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupervisorServices.getSingleSupervisorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supervisor is retrieved successfully',
    data: result,
  });
});

const getAllSupervisors = catchAsync(async (req, res) => {
  const result = await SupervisorServices.getAllSupervisorsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supervisors are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSupervisor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await SupervisorServices.updateSupervisorIntoDB(
    id,
    payload.supervisor,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supervisor is updated successfully',
    data: result,
  });
});

const deleteSupervisor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupervisorServices.deleteSupervisorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supervisor is deleted successfully',
    data: result,
  });
});

export const SupervisorControllers = {
  getAllSupervisors,
  getSingleSupervisor,
  deleteSupervisor,
  updateSupervisor,
};
