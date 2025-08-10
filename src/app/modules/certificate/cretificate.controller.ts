/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CertificateService } from './certificate.service';

import mongoose from 'mongoose';

// Create a new certificate
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

// Get all certificates for a given user
const getCertificatesByUser = catchAsync(async (req, res) => {
  const userId = req.params.userId; // make sure route uses :userId
  const query = req.query;
  const certificates = await CertificateService.getCertificatesByUser(
    userId,
    query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificates retrieved successfully',
    data: certificates,
  });
});

// Delete a certificate (soft delete)
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

// Email certificate to user
const receiveCertificateByEmail = catchAsync(async (req, res) => {
  const certificateId = req.params.id;
  const { email } = req.body;

  if (!email) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Recipient email is required',
      data: null,
    });
  }

  const result = await CertificateService.receiveCertificateByEmail(
    certificateId,
    email,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate sent via email successfully',
    data: result,
  });
});
const downloadCertificateByPdf = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid certificate ID format',
      });
    }

    const buffer = await CertificateService.downloadCertificateByPdf(id);

    if (!buffer) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    // Success - send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="certificate-${id}.pdf"`,
    );
    res.send(buffer);
  } catch (error: any) {
    // Proper error response
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Certificate generation failed',
      // Only include stack in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
});
export const CertificateController = {
  createCertificate,
  getCertificatesByUser,
  deleteCertificate,
  receiveCertificateByEmail,
  downloadCertificateByPdf,
};
