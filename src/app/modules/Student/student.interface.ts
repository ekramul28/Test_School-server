/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

// 🆕 Added new types to represent assessment progress
export type TAssessmentStep = 1 | 2 | 3;

export type TCertifiedLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  currentSemester: string;
  admissionSemester: Types.ObjectId;
  isDeleted: boolean;

  // ✅ Assessment Progress Tracking
  assessmentStep?: TAssessmentStep; // current step (1, 2, 3)
  certifiedLevels?: TCertifiedLevel[]; // certified levels like ['A1', 'A2']
  lastAssessmentScore?: number; // last score for tracking
};

export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TStudent | null>;
}
