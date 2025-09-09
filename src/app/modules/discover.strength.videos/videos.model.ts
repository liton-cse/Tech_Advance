import { model, Schema, Document } from 'mongoose';
import { IVideo, VideoModal } from './videos.interface';
const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, default: '' },
    filename: { type: String, default: '' },
    filepath: { type: String, default: '' },
    url: { type: String, default: '' },
    mark: { type: String, default: '' },
    category: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

//exist user check
videoSchema.statics.isExistVideoById = async (id: string) => {
  const isExist = await Video.findById(id);
  return isExist;
};
export const Video = model<IVideo>('Video', videoSchema);
