import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICourses } from './bootcamp.interface';

// Content Schema
const ContentSchema = new Schema({
  type: { type: String, enum: ['video', 'pdf'], required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: Number, required: false },
});

// Module Schema
const ModuleSchema = new Schema({
  name: { type: String, required: true },
  contents: { type: [ContentSchema], required: true },
});

// Courses Schema
const CoursesSchema = new Schema<ICourses>(
  {
    name: { type: String, required: true },
    modules: { type: [ModuleSchema], required: true },
  },
  { timestamps: true }
);

export const CoursesModel: Model<ICourses> = mongoose.model<ICourses>(
  'Courses',
  CoursesSchema
);
