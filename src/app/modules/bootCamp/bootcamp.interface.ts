import { Document } from 'mongoose';
export interface IContent {
  type: 'video' | 'pdf';
  title: string;
  url: string;
  duration?: number;
}

export interface IModule {
  name: string;
  contents: IContent[];
}

export interface ICourses extends Document {
  category?: string;
  name: string;
  modules: IModule[];
}

export interface IContentResponse {
  type: 'video' | 'pdf';
  title: string;
  url: string;
  duration?: number;
}

export interface IModuleResponse {
  name: string;
  contents: IContentResponse[];
}

export interface ICoursesResponse {
  _id: string;
  category: string;
  name: string;
  modules: IModuleResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCourses {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: ICourses[];
}
