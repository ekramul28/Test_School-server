import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CertificateService } from './certificate.service';

const createCertificate = catchAsync(async (req, res) => {
  const { userId, examStep, certificationLevel } = req.body;

  const certificate = await CertificateService.generateCertificate(
    userId,
    examStep,
    certificationLevel,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Certificate generated successfully',
    data: certificate,
  });
});

const getUserCertificates = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const certificates = await CertificateService.getCertificatesByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificates retrieved successfully',
    data: certificates,
  });
});

const deleteCertificate = catchAsync(async (req, res) => {
  const id = req.params.id;

  const deleted = await CertificateService.deleteCertificate(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate deleted successfully',
    data: deleted,
  });
});

export const CertificateController = {
  createCertificate,
  getUserCertificates,
  deleteCertificate,
};
