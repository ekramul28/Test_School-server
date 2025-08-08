import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { QuestionController } from './question.controller';
import {
  createQuestionSchema,
  updateQuestionSchema,
} from './question.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(createQuestionSchema),
  QuestionController.createQuestion,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.student),
  QuestionController.getAllQuestions,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.student),
  QuestionController.getSingleQuestion,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.student),
  validateRequest(updateQuestionSchema),
  QuestionController.updateQuestion,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  QuestionController.deleteQuestion,
);

export const QuestionRoutes = router;
