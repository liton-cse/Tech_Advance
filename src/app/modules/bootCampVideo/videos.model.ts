import { model, Schema } from 'mongoose';
import { IVideo, IPlaylist } from './videos.interface';

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, default: '' },
    filename: { type: String, default: '' },
    filepath: { type: String, default: '' },
    url: { type: String, default: '' },
    mark: { type: String, default: '' },
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

const playlistSchema = new Schema<IPlaylist>(
  {
    title: { type: String, required: true },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
  },
  { timestamps: true }
);

// ✅ Static method to check if playlist exists
playlistSchema.statics.isExistPlaylistById = async function (id: string) {
  return await this.findById(id).populate('videos');
};

// ✅ Static method to check if video exists
videoSchema.statics.isExistVideoById = async function (id: string) {
  return await this.findById(id);
};

// ✅ Use clean names (no spaces)
export const VideoModel = model<IVideo>('Video', videoSchema);
export const PlaylistModel = model<IPlaylist>('Playlist', playlistSchema);
