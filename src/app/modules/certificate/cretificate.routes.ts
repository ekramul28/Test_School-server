import express from 'express';
import { CertificateController } from './certificate.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createCertificateValidation } from './certificate.validation';
import { USER_ROLE } from '../User/user.constant';

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
