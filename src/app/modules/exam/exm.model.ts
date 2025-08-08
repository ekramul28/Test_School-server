import { Schema, model } from 'mongoose';
import { ExamModel, TExam, TExamAnswer, TExamScore } from './exm.interface';

const examAnswerSchema = new Schema<TExamAnswer>({
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Question',
  },
  selectedOption: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const examScoreSchema = new Schema<TExamScore>({
  step: {
    type: Number,
    required: true,
    enum: [1, 2, 3], // Step 1, 2, 3
  },
  scorePercentage: {
    type: Number,
    required: true,
  },
  certificationLevel: {
    type: String,
    required: true,
    enum: ['Fail', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  },
});

const examSchema = new Schema<TExam, ExamModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: false,
    },
    step: {
      type: Number,
      required: true,
      enum: [1, 2, 3], // Step 1: A1&A2, Step 2: B1&B2, Step 3: C1&C2
    },
    answers: {
      type: [examAnswerSchema],
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

// Filter out deleted documents by default
examSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

examSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

examSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Static method to check if user already has exam for a step
examSchema.statics.isExamExists = async function (
  userId: string,
  step: number,
) {
  const existingExam = await this.findOne({
    user: userId,
    step,
    isDeleted: false,
  });
  return existingExam;
};

export const Exam = model<TExam, ExamModel>('Exam', examSchema);
