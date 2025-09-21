import catchAsync from '../../../shared/catchAsync';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { NotificationService } from './notification.service';
// Save or update FCM token
const saveToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, username, email, fcmToken } = req.body;

      if (!userId || !username || !email || !fcmToken) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'userId, username, email and fcmToken are required',
        });
      }

      const notification = await NotificationService.saveFCMToken(
        userId,
        username,
        email,
        fcmToken
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'FCM token saved successfully',
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Send push notification
const pushNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'title, and description are required',
        });
      }

      const result = await NotificationService.sendNotification(
        title,
        description
      );

      sendResponse(res, {
        success: result.success,
        statusCode: StatusCodes.OK,
        message: result.success
          ? 'Notification sent successfully'
          : result.message || 'Failed to send notification',
        data: result.response,
      });
    } catch (err) {
      next(err);
    }
  }
);

const readNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Notification ID is required',
        });
      }

      const notification = await NotificationService.markNotificationAsRead(
        notificationId
      );

      sendResponse(res, {
        success: !!notification,
        statusCode: notification ? StatusCodes.OK : StatusCodes.NOT_FOUND,
        message: notification
          ? 'Notification marked as read'
          : 'Notification not found',
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  }
);

const unreadNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const notifications = await NotificationService.getUnreadNotifications(
      userId
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Unread notifications retrieved successfully',
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};
export const NotificationController = {
  pushNotification,
  saveToken,
  readNotification,
  unreadNotifications,
};
