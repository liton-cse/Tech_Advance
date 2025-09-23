// services/notification.service.ts
import admin from 'firebase-admin';
import {
  NotificationModel,
  NotificationHistoryModel,
} from './notification.model';
import {
  INotification,
  INotificationHistory,
  SendNotificationResult,
} from './notification.interface';
import { Types } from 'mongoose';

// Save or update FCM token when user login.

const saveFCMToken = async (
  userId: string,
  username: string,
  email: string,
  fcmToken: string
): Promise<INotification> => {
  const existing = await NotificationModel.findOne({ fcmToken });
  if (existing) {
    return existing;
  }
  const newNotification = new NotificationModel({
    userId,
    username,
    email,
    fcmToken,
    lastActive: new Date(),
  });

  return await newNotification.save();
};

// Send notification to all devices of a user
const CHUNK_SIZE = 200; // FCM max batch size

const sendCustomNotification = async (
  title: string,
  description: string,
  groupId?: Types.ObjectId,
  contentId?: Types.ObjectId,
  contentUrl?: string
): Promise<SendNotificationResult> => {
  const devices = await NotificationModel.find();
  const tokens: string[] = devices.map((d: any) => d.fcmToken).filter(Boolean);

  if (tokens.length === 0) {
    return { success: false, message: 'No devices found' };
  }

  const messaging = admin.messaging();

  // Split tokens into batches of 200
  const batches: string[][] = [];
  for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
    batches.push(tokens.slice(i, i + CHUNK_SIZE));
  }

  // Process batches in parallel
  const batchResults = await Promise.all(
    batches.map(async batch => {
      const message: admin.messaging.MulticastMessage = {
        notification: { title, body: description },
        tokens: batch,
      };
      const messaging = admin.messaging() as admin.messaging.Messaging & {
        sendMulticast: (
          message: admin.messaging.MulticastMessage
        ) => Promise<admin.messaging.BatchResponse>;
      };
      const response = await messaging.sendMulticast(message);

      // Handle failed tokens
      const failedTokens: string[] = [];
      response.responses.forEach(
        (res: admin.messaging.SendResponse, idx: number) => {
          if (!res.success) {
            failedTokens.push(batch[idx]);
          }
        }
      );

      // Remove invalid tokens from DB
      if (failedTokens.length > 0) {
        await NotificationModel.deleteMany({ fcmToken: { $in: failedTokens } });
      }

      // Save notification history
      const historyPromises = batch.map(token =>
        NotificationHistoryModel.create({
          title,
          description,
          fcmToken: token,
          groupId,
          contentId,
          contentUrl,
        } as INotificationHistory)
      );
      await Promise.all(historyPromises);

      return response;
    })
  );

  return { success: true, response: batchResults };
};

//Mark the read and unread notification...
const markNotificationAsRead = async (notificationId: string) => {
  return NotificationHistoryModel.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
};
//get unmark message from notification...
const getUnreadNotifications = async (userId: string) => {
  return NotificationHistoryModel.find({ userId, read: false }).sort({
    sentAt: -1,
  });
};

export const NotificationService = {
  saveFCMToken,
  sendCustomNotification,
  markNotificationAsRead,
  getUnreadNotifications,
};
