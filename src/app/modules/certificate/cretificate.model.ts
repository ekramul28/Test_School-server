import { Schema, model } from 'mongoose';
import { CertificateModel, TCertificate } from './cretificate.interface';

const certificateSchema = new Schema<TCertificate, CertificateModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    examStep: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    certificationLevel: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    certificateUrl: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Static method to generate certificate record
certificateSchema.statics.generateCertificate = async function (
  userId,
  examStep,
  certificationLevel,
) {
  const existingCertificate = await this.findOne({
    user: userId,
    examStep,
    isDeleted: false,
  });

  if (existingCertificate) {
    return existingCertificate;
  }

  const newCertificate = await this.create({
    user: userId,
    examStep,
    certificationLevel,
    issueDate: new Date(),
  });

  return newCertificate;
};

export const Certificate = model<TCertificate, CertificateModel>(
  'Certificate',
  certificateSchema,
);
