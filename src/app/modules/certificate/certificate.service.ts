import { Types } from 'mongoose';

import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { Certificate } from './cretificate.model';

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
  return await Certificate.create({
    user: data.user,
    examStep: data.examStep,
    certificationLevel: data.certificationLevel,
    issuedAt: data.issuedAt || new Date(),
    isDeleted: false,
  });
};

const getCertificatesByUser = async (userId: string) => {
  return await Certificate.find({ user: userId, isDeleted: false }).populate(
    'user',
  );
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
  const certificate =
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
    doc
      .fontSize(18)
      .text(`Awarded to: ${certificate.user?.email}`, { align: 'center' });
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
  const certificate =
    await Certificate.findById(certificateId).populate('user');
  if (!certificate) throw new Error('Certificate not found');

  const pdfBuffer = await downloadCertificateByPdf(certificateId);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your Company" <${process.env.SMTP_FROM}>`,
    to: recipientEmail,
    subject: 'Your Certificate',
    text: `Dear ${certificate.user.name},\n\nPlease find your certificate attached.\n\nBest regards,\nYour Company`,
    attachments: [
      {
        filename: `certificate-${certificateId}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

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
