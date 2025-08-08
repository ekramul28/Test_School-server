import express from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { USER_ROLE } from '../User/user.constant';
import { createCertificateValidation } from './cretificate.validation';
import { CertificateController } from './cretificate.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.student, USER_ROLE.admin),
  validateRequest(createCertificateValidation),
  CertificateController.createCertificate,
);

router.get(
  '/user/:userId',
  auth(USER_ROLE.student, USER_ROLE.admin),
  CertificateController.getUserCertificates,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  CertificateController.deleteCertificate,
);

export const CertificateRoutes = router;
