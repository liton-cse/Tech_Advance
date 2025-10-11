import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CourseService } from './bootcamp.service';
import { IContent } from './bootcamp.interface';
import { NotificationService } from '../notification/notification.service';

// =========================
// ====== COURSES ======
// =========================

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Public / Admin
 * @body    { category: string, name: string, modules: Array }
 */
export const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Course created successfully',
    data: result,
  });
});

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 * @query   page, limit (optional for pagination)
 */
export const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await CourseService.getAllCourses(page, limit);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Courses retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

/**
 * @desc    Get a single course by ID
 * @route   GET /api/courses/:courseId
 * @access  Public
 */
export const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getCourseById(req.params.courseId);
  sendResponse(res, {
    success: !!result,
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: result ? 'Course retrieved successfully' : 'Course not found',
    data: result,
  });
});

/**
 * @desc    Update a course name
 * @route   PATCH /api/courses/:courseId
 * @access  Public / Admin
 * @body    { name: string }
 */
export const updateCourseName = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CourseService.updateCourseName(
      req.params.courseId,
      req.body.name
    );
    sendResponse(res, {
      success: !!result,
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: result ? 'Course updated successfully' : 'Course not found',
      data: result,
    });
  }
);

/**
 * @desc    Delete a course
 * @route   DELETE /api/courses/:courseId
 * @access  Public / Admin
 */
export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.deleteCourse(req.params.courseId);
  sendResponse(res, {
    success: !!result,
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: result ? 'Course deleted successfully' : 'Course not found',
    data: result,
  });
});

// =========================
// ====== MODULES ======
// =========================

/**
 * @desc    Add a new module to a course
 * @route   POST /api/courses/:courseId/modules
 * @access  Public / Admin
 * @body    { name: string, contents: Array }
 */
export const addModuleToCourse = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CourseService.addModuleToCourse(
      req.params.courseId,
      req.body
    );
    sendResponse(res, {
      success: !!result,
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: result ? 'Module added successfully' : 'Course not found',
      data: result,
    });
  }
);

/**
 * @desc    Update a module name
 * @route   PATCH /api/courses/:courseId/modules/:moduleId
 * @access  Public / Admin
 * @body    { name: string }
 */
export const updateModuleName = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CourseService.updateModuleName(
      req.params.courseId,
      req.params.moduleId,
      req.body.name
    );
    sendResponse(res, {
      success: !!result,
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: result ? 'Module updated successfully' : 'Module not found',
      data: result,
    });
  }
);

/**
 * @desc    Delete a module from a course
 * @route   DELETE /api/courses/:courseId/modules/:moduleId
 * @access  Public / Admin
 */
export const deleteModule = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.deleteModule(
    req.params.courseId,
    req.params.moduleId
  );
  sendResponse(res, {
    success: !!result,
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: result ? 'Module deleted successfully' : 'Module not found',
    data: result,
  });
});

// =========================
// ====== CONTENT ======
// =========================

/**
 * @desc    Add a new content (video/pdf) to a module
 * @route   POST /api/courses/:courseId/modules/:moduleId/contents
 * @access  Public / Admin
 * @body    { type: string, title: string, url: string, duration?: number }
 */
export const addContentToModule = catchAsync(
  async (req: Request, res: Response) => {
    const { title, type } = req.body;
    const payload: any = {
      title: title ?? '',
      type,
    };
    // ✅ Check for uploaded media files and set URL
    if (type === 'video') {
      const videoFiles = (req.files as any)?.['media'];
      if (!videoFiles || videoFiles.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Video file must be provided!',
        });
      }
      payload.url = videoFiles[0].filename;
    } else if (type === 'pdf') {
      const pdfFiles = (req.files as any)?.['doc'];
      if (!pdfFiles || pdfFiles.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'PDF file must be provided!',
        });
      }
      payload.url = pdfFiles[0].filename;
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid content type! Must be "video" or "pdf".',
      });
    }

    // Add content to module
    const result = await CourseService.addContentToModule(
      req.params.courseId,
      req.params.moduleId,
      payload
    );
    const notificationTitle = `${title} is uploades recently!`;
    const description = type;

    // Notify all users
    await NotificationService.sendCustomNotification(
      notificationTitle,
      description
    );
    sendResponse(res, {
      success: !!result,
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: result ? 'Content added successfully' : 'Module not found',
      data: result,
    });
  }
);

/**
 * @desc    Update content title (video/pdf)
 * @route   PATCH /api/courses/:courseId/modules/:moduleId/contents/:contentId
 * @access  Public / Admin
 * @body    { title: string }
 */
export const updateContentTitle = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CourseService.updateContentTitle(
      req.params.courseId,
      req.params.moduleId,
      req.params.contentId,
      req.body.title
    );
    sendResponse(res, {
      success: !!result,
      statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: result ? 'Content updated successfully' : 'Content not found',
      data: result,
    });
  }
);

/**
 * @desc    Delete content (video/pdf) from a module
 * @route   DELETE /api/courses/:courseId/modules/:moduleId/contents/:contentId
 * @access  Public / Admin
 */
export const deleteContent = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.deleteContent(
    req.params.courseId,
    req.params.moduleId,
    req.params.contentId
  );
  sendResponse(res, {
    success: !!result,
    statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    message: result ? 'Content deleted successfully' : 'Content not found',
    data: result,
  });
});
