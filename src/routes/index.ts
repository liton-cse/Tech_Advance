import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/notification/notification.routes';
import { QuizRoutes } from '../app/modules/discover.strength.quiz/quiz.route';
import { VideoRouter } from '../app/modules/discover.strength.videos/videos.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/quiz',
    route: QuizRoutes,
  },
  {
    path: '/video',
    route: VideoRouter,
  },
  {
    path: '/notification',
    route: NotificationRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
