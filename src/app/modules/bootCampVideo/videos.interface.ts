import { Model, Types } from 'mongoose';
export interface IVideo {
  title?: string | '';
  filename?: string | '';
  filepath?: string | '';
  uploadedAt?: Date | '';
  url?: string | '';
  mark?: string | '';
  remarks?: string | '';
  category?: string | '';
}

export type VideoModal = {
  isExistVideoById(id: string): any;
} & Model<IVideo>;

export interface IPlaylist extends Document {
  title: string;
  videos?: Types.ObjectId[] | IVideo[];
  createdAt?: Date;
  updatedAt?: Date;
}
