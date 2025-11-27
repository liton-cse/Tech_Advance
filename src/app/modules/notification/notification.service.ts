// services/notification.service.ts
import admin from '../../../config/firebase';
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
  console.log('not', fcmToken);
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
const CHUNK_SIZE = 500; // FCM max batch size

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

  // Split into 200-token batches
  const batches: string[][] = [];
  for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
    batches.push(tokens.slice(i, i + CHUNK_SIZE));
  }

  const batchResults = await Promise.all(
    batches.map(async batch => {
      const message: admin.messaging.MulticastMessage = {
        notification: { title, body: description },
        tokens: batch,
      };

      // Modern API
      const response = await admin.messaging().sendEachForMulticast(message);

      // Filter invalid tokens
      // const failedTokens = batch.filter(
      //   (_, idx) => !response.responses[idx].success
      // );

      // // Remove invalid tokens from DB
      // if (failedTokens.length > 0) {
      //   await NotificationModel.deleteMany({ fcmToken: { $in: failedTokens } });
      // }

      // Save history
      await Promise.all(
        batch.map(token =>
          NotificationHistoryModel.create({
            title,
            description,
            fcmToken: token,
            groupId,
            contentId,
            contentUrl,
          })
        )
      );

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

const getNotification = async () => {
  return await NotificationHistoryModel.find().sort({ createdAt: -1 });
};

export const NotificationService = {
  saveFCMToken,
  sendCustomNotification,
  markNotificationAsRead,
  getUnreadNotifications,
  getNotification,
};
