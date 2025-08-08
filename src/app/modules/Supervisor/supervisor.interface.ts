/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TSupervisor = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  designation: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  joiningDate: Date;
  assignedDepartment: Types.ObjectId;
  academicFaculty?: Types.ObjectId;
  profileImg?: string;
  isDeleted: boolean;
};

// For creating static methods on Supervisor model
export interface SupervisorModel extends Model<TSupervisor> {
  // Check if a supervisor user exists
  isUserExists(id: string): Promise<TSupervisor | null>;
}
