import { Document, Types } from 'mongoose';
export interface IQuizQuestion extends Document {
  questionText: string;
  answers: string[];
}

export interface ICategory extends Document {
  category: string;
  questions: Types.DocumentArray<IQuizQuestion>;
}
export interface IAssessment extends Document {
  range: string;
  begineerData: string;
  IntermediateData: string;
  proData: string;
}

export interface IAssessmentCategory extends Document {
  category: string;
  assessment: Types.DocumentArray<IAssessment>;
}
