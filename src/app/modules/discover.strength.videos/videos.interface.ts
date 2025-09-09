import { Model } from 'mongoose';
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
