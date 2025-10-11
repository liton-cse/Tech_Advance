import { VideoModel, PlaylistModel } from './videos.model';
import { IVideo, IPlaylist } from './videos.interface';
import { Types } from 'mongoose';

// ----------------- VIDEO -----------------
const addVideo = async (videoData: IVideo) => {
  return await VideoModel.create(videoData);
};

const getAllVideos = async () => {
  return await VideoModel.find();
};

const getVideoById = async (id: string) => {
  return await VideoModel.findById(id);
};

const updateVideo = async (id: string, updatedData: Partial<IVideo>) => {
  return await VideoModel.findByIdAndUpdate(id, updatedData, { new: true });
};

const deleteVideo = async (id: string) => {
  return await VideoModel.findByIdAndDelete(id);
};

// ----------------- PLAYLIST -----------------
const addPlaylist = async (playlistData: IPlaylist) => {
  return await PlaylistModel.create(playlistData);
};

const getAllPlaylists = async () => {
  return await PlaylistModel.find().populate('videos');
};

const getPlaylistById = async (id: string) => {
  return await PlaylistModel.findById(id).populate('videos');
};

const updatePlaylist = async (id: string, updatedData: Partial<IPlaylist>) => {
  return await PlaylistModel.findByIdAndUpdate(id, updatedData, {
    new: true,
  }).populate('videos');
};

const deletePlaylist = async (id: string) => {
  return await PlaylistModel.findByIdAndDelete(id);
};

// Add a video to a playlist
const addVideoToPlaylist = async (playlistId: string, videos: string[]) => {
  const objectIds = videos.map(id => new Types.ObjectId(id));

  // Find playlist and push videos
  const playlist = await PlaylistModel.findByIdAndUpdate(playlistId, {
    $addToSet: { videos: { $each: objectIds } },
  });

  return playlist;
};

// ----------------- EXPORT SERVICE -----------------
export const VideoPlaylistService = {
  // Videos
  addVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,

  // Playlists
  addPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
};
