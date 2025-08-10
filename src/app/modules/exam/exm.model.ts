import { Schema, model } from 'mongoose';
import { ExamModel, TExam, TExamScore } from './exm.interface';

// TypeScript interfaces (example)

const examScoreSchema = new Schema<TExamScore>({
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
});

const examSchema = new Schema<TExam, ExamModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    step: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    certificationLevel: {
      type: String,
      enum: ['Fail', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      required: true,
    },
    score: {
      type: examScoreSchema,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isRetakeAllowed: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Middleware to exclude deleted exams by default
examSchema.pre('find', function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
examSchema.pre('findOne', function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
examSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Static method to check if exam exists for a user and step
examSchema.statics.isExamExists = async function (
  userId: string,
  step: number,
) {
  return await this.findOne({ user: userId, step, isDeleted: false });
};

export const Exam = model<TExam, ExamModel>('Exam', examSchema);
