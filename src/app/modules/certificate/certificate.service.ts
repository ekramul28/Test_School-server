/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { Types } from 'mongoose';

import PDFDocument from 'pdfkit';
import { Certificate } from './cretificate.model';
import { sendEmail } from '../../utils/sendEmail';
import QueryBuilder from '../../builder/QueryBuilder';
const CertificateSearchableFields = ['certificationLevel']; // adjust fields as needed
const generateCertificate = async (
  userId: Types.ObjectId,
  examStep: 1 | 2 | 3,
  certificationLevel: string,
) => {
  return await Certificate.generateCertificate(
    userId,
    examStep,
    certificationLevel,
  );
};

const createCertificate = async (data: {
  user: Types.ObjectId | string;
  examStep: 1 | 2 | 3;
  certificationLevel: string;
  issuedAt?: Date;
}) => {
  const existing = await Certificate.findOne({
    user: data.user,
    examStep: data.examStep,
    isDeleted: false,
  });

  if (existing) {
    // If exists, return the existing certificate
    return existing;
  }

  return await Certificate.create({
    user: data.user,
    examStep: data.examStep,
    certificationLevel: data.certificationLevel,
    issuedAt: data.issuedAt || new Date(),
    isDeleted: false,
  });
};

export const getCertificatesByUser = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // Ensure examStep has a default value if not provided
  if (!query.examStep) {
    query.examStep = 1;
  }

  // Always include the user filter
  const certificateQuery = new QueryBuilder(
    Certificate.find({ user: userId, isDeleted: false }),
    query,
  )
    .search(CertificateSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await certificateQuery.modelQuery.populate('user');
  const meta = await certificateQuery.countTotal();

  return {
    data: result,
    meta,
  };
};

const deleteCertificate = async (id: string) => {
  return await Certificate.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
};

const downloadCertificateByPdf = async (
  certificateId: string,
): Promise<Buffer> => {
  const certificate: any =
    await Certificate.findById(certificateId).populate('user');
  if (!certificate) throw new Error('Certificate not found');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Uint8Array[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    doc.fontSize(25).text('Certificate of Achievement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`Awarded to: ${certificate.user?.email as string}`, {
      align: 'center',
    });
    doc.text(`Level: ${certificate.certificationLevel}`, { align: 'center' });
    doc.text(`Step: ${certificate.examStep}`, { align: 'center' });
    doc.text(`Issued on: ${certificate.issueDate.toDateString()}`, {
      align: 'center',
    });

    doc.end();
  });
};

const receiveCertificateByEmail = async (
  certificateId: string,
  recipientEmail: string,
) => {
  const certificate = await Certificate.findById(certificateId);
  if (!certificate) throw new Error('Certificate not found');

  const pdfBuffer = await downloadCertificateByPdf(certificateId);

  sendEmail(
    recipientEmail,
    '',
    'This is your Certificate',
    pdfBuffer,
    `certificate-${certificateId}.pdf`,
  );

  return { success: true, message: 'Certificate emailed successfully' };
};

export const CertificateService = {
  generateCertificate,
  createCertificate,
  getCertificatesByUser,
  deleteCertificate,
  downloadCertificateByPdf,
  receiveCertificateByEmail,
};
