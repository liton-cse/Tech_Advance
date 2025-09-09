import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VideoService } from './videos.service';
import { IVideo } from './videos.interface';

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

    const result = await VideoService.createVideo(payload);

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
  const result = await VideoService.getAllVideos();
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
  const result = await VideoService.getVideoById(id);
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
  const result = await VideoService.updateVideo(id, payload);

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
  const result = await VideoService.deleteVideo(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Video deleted successfully',
    data: result,
  });
});

export const VideoController = {
  createVideo,
  getAllVideos,
  getVideo,
  updateVideo,
  deleteVideo,
};
