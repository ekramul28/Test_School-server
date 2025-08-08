import { Schema, model } from 'mongoose';
import { QuestionModel, TQuestion } from './question.interface';

const questionSchema = new Schema<TQuestion, QuestionModel>(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function (value: string[]) {
          return value.length >= 2;
        },
        message: 'At least two options are required',
      },
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    competency: {
      type: String,
      required: [true, 'Competency is required'],
    },
    durationInSeconds: {
      type: Number,
      default: 60, // Default 1 min if not specified
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Pre-hooks to exclude deleted documents
questionSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

questionSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

questionSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Question = model<TQuestion, QuestionModel>(
  'Question',
  questionSchema,
);
