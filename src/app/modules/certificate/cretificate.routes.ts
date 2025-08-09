import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { createCertificateValidation } from './cretificate.validation';
import { CertificateController } from './cretificate.controller';

const router = express.Router();

// Create a new certificate
router.post(
  '/',
  auth(USER_ROLE.student, USER_ROLE.admin),
  validateRequest(createCertificateValidation),
  CertificateController.createCertificate,
);

// Get all certificates for a specific user
router.get(
  '/user/:userId',
  auth(USER_ROLE.student, USER_ROLE.admin),
  CertificateController.getCertificatesByUser,
);

// Soft delete a certificate
router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  CertificateController.deleteCertificate,
);

// Send a certificate by email (POST because it triggers an action)
router.post(
  '/:id/send-email',
  auth(USER_ROLE.admin, USER_ROLE.student),
  CertificateController.receiveCertificateByEmail,
);

export const CertificateRoutes = router;
