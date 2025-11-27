import mongoose, { Schema, model, Document } from 'mongoose';
import { IFeedBack, ITermsAndCondition } from './interface';

const feedbackSchema = new Schema<IFeedBack>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: { type: String },
    comments: String,
  },
  { timestamps: true }
);

const termsAndConditionSchema = new Schema<ITermsAndCondition>(
  {
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const TermsAndConditionModel = model<ITermsAndCondition>(
  'TermsAndCondition',
  termsAndConditionSchema
);

export const FeedbackModel = model<IFeedBack>('Feedback', feedbackSchema);
