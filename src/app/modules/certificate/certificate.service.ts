import { Types } from 'mongoose';
import { Certificate } from './cretificate.model';

const generateCertificate = async (
  userId: Types.ObjectId,
  examStep: 1 | 2 | 3,
  certificationLevel: string,
) => {
  const certificate = await Certificate.generateCertificate(
    userId,
    examStep,
    certificationLevel,
  );
  return certificate;
};

const getCertificatesByUser = async (userId: string) => {
  const certificates = await Certificate.find({
    user: userId,
    isDeleted: false,
  });
  return certificates;
};

const deleteCertificate = async (id: string) => {
  const certificate = await Certificate.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return certificate;
};

export const CertificateService = {
  generateCertificate,
  getCertificatesByUser,
  deleteCertificate,
};
