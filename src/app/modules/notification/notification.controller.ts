import { Request, Response } from 'express';
import * as notificationService from './notification.service';

// send notification dynamically
export const sendNotification = (req: Request, res: Response) => {
  const headers = req.headers;
  const body = req.body;

  const newNotification = notificationService.createNotification(headers, body);

  res.status(201).json({
    message: 'Notification created successfully',
    notification: newNotification,
    openUrl: `/api/notifications/${newNotification.id}`,
  });
};

// when user clicks notification, redirect
export const openNotification = (req: Request, res: Response) => {
  const { id } = req.params;

  const notification = notificationService.getNotificationById(id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  // redirect user to the content
  return res.redirect(notification.link);
};
