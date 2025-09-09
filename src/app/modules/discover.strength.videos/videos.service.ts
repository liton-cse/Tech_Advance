import { Video } from './videos.model';
import { IVideo } from './videos.interface';

export const VideoService = {
  // CREATE video
  createVideo: async (payload: Partial<IVideo>): Promise<IVideo> => {
    const newVideo = await Video.create(payload);
    return newVideo;
  },

  // READ all videos
  getAllVideos: async (): Promise<IVideo[]> => {
    const videos = await Video.find();
    return videos;
  },

  // READ single video
  getVideoById: async (id: string): Promise<IVideo | null> => {
    const video = await Video.findById(id);
    return video;
  },

  // UPDATE video
  updateVideo: async (
    id: string,
    payload: Partial<IVideo>
  ): Promise<IVideo | null> => {
    const updatedVideo = await Video.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return updatedVideo;
  },

  // DELETE video
  deleteVideo: async (id: string): Promise<IVideo | null> => {
    const deletedVideo = await Video.findByIdAndDelete(id);
    return deletedVideo;
  },
};
