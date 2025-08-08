import express from 'express';
import { SupervisorControllers } from './supervisor.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { updateSupervisorValidationSchema } from './supervisor.validation';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SupervisorControllers.getAllSupervisors,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SupervisorControllers.getSingleSupervisor,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(updateSupervisorValidationSchema),
  SupervisorControllers.updateSupervisor,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin),
  SupervisorControllers.deleteSupervisor,
);

export const SupervisorRoutes = router;
