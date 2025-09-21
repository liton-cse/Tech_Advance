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

// Save or update FCM token
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
const sendNotification = async (
  title: string,
  description: string
): Promise<SendNotificationResult> => {
  const devices = await NotificationModel.find();
  const tokens: string[] = devices.map((d: any) => d.fcmToken);

  if (tokens.length === 0) {
    return { success: false, message: 'No devices found' };
  }

  const message: admin.messaging.MulticastMessage = {
    notification: { title, body: description },
    tokens,
  };

  // TypeScript-safe cast
  const messaging = admin.messaging() as admin.messaging.Messaging & {
    sendMulticast: (
      msg: admin.messaging.MulticastMessage
    ) => Promise<admin.messaging.BatchResponse>;
  };

  const response = await messaging.sendMulticast(message);

  // Save notification history
  const historyPromises = tokens.map((token: string) =>
    NotificationHistoryModel.create({
      title,
      description,
      fcmToken: token,
    } as INotificationHistory)
  );

  await Promise.all(historyPromises);

  return { success: true, response };
};

//Mark the read and unread notification...
const markNotificationAsRead = async (notificationId: string) => {
  return NotificationHistoryModel.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
};
//
const getUnreadNotifications = async (userId: string) => {
  return NotificationHistoryModel.find({ userId, read: false }).sort({
    sentAt: -1,
  });
};

export const NotificationService = {
  saveFCMToken,
  sendNotification,
  markNotificationAsRead,
  getUnreadNotifications,
};
