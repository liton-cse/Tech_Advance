import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VideoPlaylistService } from './videos.service';
import { IPlaylist, IVideo } from './videos.interface';
import { NotificationService } from '../notification/notification.service';

// CREATE video
const createVideo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, url, mark, category } = req.body;

    const payload: IVideo = {
      title: title ?? '',
      mark: mark ?? '',
      category: category ?? '',
    };

    // ✅ check for uploaded media files
    if (req.files && 'media' in req.files) {
      const mediaFile = (req.files as any)['media'][0]; // first uploaded media
      payload.filename = mediaFile.filename ?? '';
      payload.filepath = mediaFile.path ?? '';
    }

    if (url) {
      payload.url = url;
    }

    if ((!req.files || !('media' in req.files)) && !url) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Video file or URL must be provided!',
      });
    }

    const result = await VideoPlaylistService.addVideo(payload);
    // Notify all users
    await NotificationService.sendCustomNotification(
      category,
      title,
      result._id,
      url
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Video uploaded successfully',
      data: result,
    });
  }
);

// GET all videos
const getAllVideos = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoPlaylistService.getAllVideos();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Videos retrieved successfully',
    data: result,
  });
});

// GET single video by ID
const getVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoPlaylistService.getVideoById(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Video retrieved successfully',
    data: result,
  });
});

// UPDATE video
const updateVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, url, mark, category } = req.body;
  const payload: Partial<IVideo> = {};

  if (title !== undefined) payload.title = title;
  if (mark !== undefined) payload.mark = mark;
  if (category !== undefined) payload.category = category;

  if (req.files && 'media' in req.files) {
    const mediaFile = (req.files as any)['media'][0];
    payload.filename = mediaFile.filename;
    payload.filepath = mediaFile.path;
  }
  if (url !== undefined) {
    payload.url = url;
  }
  const result = await VideoPlaylistService.updateVideo(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Video updated successfully',
    data: result,
  });
});

// DELETE video
const deleteVideo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoPlaylistService.deleteVideo(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Video deleted successfully',
    data: result,
  });
});

// ----------------- PLAYLIST -----------------
const addPlaylist = catchAsync(async (req: Request, res: Response) => {
  const playlist: IPlaylist = req.body;
  const result = await VideoPlaylistService.addPlaylist(playlist);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Playlist created successfully',
    data: result,
  });
});

const getAllPlaylists = catchAsync(async (req: Request, res: Response) => {
  const result = await VideoPlaylistService.getAllPlaylists();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Playlists fetched successfully',
    data: result,
  });
});

const getPlaylistById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoPlaylistService.getPlaylistById(id);

  sendResponse(res, {
    success: true,
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: result ? 'Playlist fetched successfully' : 'Playlist not found',
    data: result,
  });
});

const updatePlaylist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoPlaylistService.updatePlaylist(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: result ? 'Playlist updated successfully' : 'Playlist not found',
    data: result,
  });
});

const deletePlaylist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VideoPlaylistService.deletePlaylist(id);

  sendResponse(res, {
    success: true,
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: result ? 'Playlist deleted successfully' : 'Playlist not found',
    data: result,
  });
});

const addVideoToPlaylist = catchAsync(async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  const { videos } = req.body; // expecting an array of strings

  if (!Array.isArray(videos) || videos.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'videoIds must be a non-empty array',
    });
  }

  const result = await VideoPlaylistService.addVideoToPlaylist(
    playlistId,
    videos
  );

  sendResponse(res, {
    success: true,
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: result
      ? 'Videos added to playlist successfully'
      : 'Playlist not found',
    data: result,
  });
});

export const VideoController = {
  //----single video----
  createVideo,
  getAllVideos,
  getVideo,
  updateVideo,
  deleteVideo,

  //-----playlist----
  addPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
};
