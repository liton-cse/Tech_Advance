import { Router } from 'express';
import { sendNotification, openNotification } from './notification.controller';

const router = Router();

// Create/send a new notification
router.post('/', sendNotification);

// Handle click on notification
router.get('/:id', openNotification);

export const NotificationRoutes = router;
