/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { Types } from 'mongoose';

import path from 'path';
import PDFDocument from 'pdfkit';
import { Certificate } from './cretificate.model';
import { sendEmail } from '../../utils/sendEmail';

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
  // Set default examStep if not provided or invalid
  const examStep = query.examStep ? Number(query.examStep) : 1;

  // Base query with user filter
  const baseQuery = {
    user: userId,
    isDeleted: false,
    ...(examStep && { examStep }), // Only add examStep if it exists
  };

  // Execute query and populate user data
  const result = await Certificate.find(baseQuery).populate('user');

  return result;
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
  const certificate: any = await Certificate.findById(certificateId)
    .populate('user')
    .populate('exam');

  if (!certificate) throw new Error('Certificate not found');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 50,
    });

    const chunks: Uint8Array[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    // Add decorative border
    doc
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .stroke('#1a73e8')
      .lineWidth(3);

    // Add certificate header with logo
    doc
      .image(path.join(__dirname, 'src/app/assets/logo.jpg'), 50, 50, {
        width: 100,
      })
      .fillColor('#1a73e8')
      .fontSize(36)
      .text('Certificate of Achievement', {
        align: 'center',
        underline: true,
        paragraphGap: 10,
      });

    // Main content
    doc
      .moveDown(1.5)
      .fillColor('#333333')
      .fontSize(24)
      .text('This is to certify that', { align: 'center' });

    doc
      .moveDown(0.5)
      .fillColor('#1a73e8')
      .font('Helvetica-Bold')
      .fontSize(32)
      .text(certificate.user?.name || certificate.user?.email, {
        align: 'center',
        paragraphGap: 15,
      });

    doc
      .moveDown(0.5)
      .fillColor('#333333')
      .font('Helvetica')
      .fontSize(18)
      .text(
        `has successfully completed the ${certificate.certificationLevel} level assessment`,
        {
          align: 'center',
          lineGap: 10,
        },
      );

    // Achievement details
    doc
      .moveDown(1.5)
      .fillColor('#666666')
      .fontSize(16)
      .text(`Assessment Step: ${certificate.examStep}`, { align: 'center' })
      .text(
        `Score: ${certificate.exam?.score?.correctAnswers || 0}/${
          certificate.exam?.score?.totalQuestions || 0
        }`,
        { align: 'center' },
      )
      .text(`Completion Date: ${certificate.issueDate.toLocaleDateString()}`, {
        align: 'center',
      });

    // Signature section
    doc
      .moveDown(3)
      .fillColor('#1a73e8')
      .fontSize(14)
      .text('_________________________', { align: 'right' })
      .text('Authorized Signature', { align: 'right' });

    // Footer
    doc
      .fontSize(10)
      .fillColor('#999999')
      .text('Certificate ID: ' + certificate._id, 50, doc.page.height - 80)
      .text('© 2023 Your Company Name. All rights reserved.', {
        align: 'center',
        width: doc.page.width - 100,
        lineGap: 5,
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
