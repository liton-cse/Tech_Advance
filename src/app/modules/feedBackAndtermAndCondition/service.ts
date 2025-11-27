import { IFeedBack } from './interface';
import { FeedbackModel, TermsAndConditionModel } from './model';

export const createFeedbackService = async (data: IFeedBack) => {
  return await FeedbackModel.create(data);
};

export const getFeedbacksService = async (id: string) => {
  return await FeedbackModel.find()
    .populate('userId', 'name email image')
    .sort({ createdAt: -1 });
};

export const deleteFeedbackService = async (id: string) => {
  const feedback = await FeedbackModel.findByIdAndDelete(id);
  return feedback;
};

export const getTermsService = async () => {
  return await TermsAndConditionModel.findOne();
};

export const createOrUpdateTermsService = async (content: string) => {
  let terms = await TermsAndConditionModel.findOne();

  if (!terms) {
    // Create new if none exists
    terms = await TermsAndConditionModel.create({ content });
  } else {
    // Update existing
    terms.content = content;
    await terms.save();
  }
  return terms;
};
