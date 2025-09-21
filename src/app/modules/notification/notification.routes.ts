// routes/notification.route.ts
import { Router } from 'express';
import { NotificationController } from './notification.controller';

const router = Router();

router.post('/send', NotificationController.pushNotification);

router.patch('/read/:notificationId', NotificationController.readNotification);

router.get('/unread/:userId', NotificationController.unreadNotifications);

export const NotificationRoutes = router;
0;
