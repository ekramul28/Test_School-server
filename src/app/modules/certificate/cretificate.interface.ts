/* eslint-disable no-unused-vars */
import { Document, Model, Types } from 'mongoose';

export interface TCertificate extends Document {
  user: Types.ObjectId;
  examStep: 1 | 2 | 3;
  certificationLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  issueDate: Date;
  certificateUrl?: string; // URL for downloadable PDF or online certificate
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CertificateModel extends Model<TCertificate> {
  generateCertificate(
    userId: Types.ObjectId,
    examStep: 1 | 2 | 3,
    certificationLevel: string,
  ): Promise<TCertificate>;
}
