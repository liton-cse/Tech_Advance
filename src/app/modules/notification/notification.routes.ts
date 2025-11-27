// routes/notification.route.ts
import { Router } from 'express';
import { NotificationController } from './notification.controller';

import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = Router();

router.get(
  '/',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  NotificationController.getAllNotification
);
router.post('/send', NotificationController.pushNotification);

router.patch('/read/:notificationId', NotificationController.readNotification);

router.get('/unread/:userId', NotificationController.unreadNotifications);

export const NotificationRoutes = router;
