import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';

import { ExamControllers } from './exm.controller';
import {
  createExamValidationSchema,
  updateExamValidationSchema,
} from './exm.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.student, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createExamValidationSchema),
  ExamControllers.createExam,
);

router.get(
  '/user/:userId/step/:step',
  auth(USER_ROLE.student, USER_ROLE.admin, USER_ROLE.superAdmin),
  ExamControllers.getExamByUserAndStep,
);

router.get(
  '/user/:userId',
  auth(USER_ROLE.student, USER_ROLE.admin, USER_ROLE.superAdmin),
  ExamControllers.getExamsByUser,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateExamValidationSchema),
  ExamControllers.updateExam,
);

router.delete('/:id', auth(USER_ROLE.superAdmin), ExamControllers.deleteExam);

export const ExamRoutes = router;
