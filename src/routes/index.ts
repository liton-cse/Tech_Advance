import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/notification/notification.routes';
import { MockInterviewRoutes } from '../app/modules/mock.interview/quiz.route';
import { BootcampRouter } from '../app/modules/bootCampVideo/videos.route';
import { CoachingRoutes } from '../app/modules/coaching/coaching.route';
import { CommunityRoutes } from '../app/modules/community/community.route';
import { DashboardRoute } from '../app/modules/dashboard/dashboard.route';
import { SamllBusinessRoute } from '../app/modules/small.business/small.business.route';
import { BusinessPlanRoutes } from '../app/modules/business.plan/business.plan.route';
import { SuccessPathRoutes } from '../app/modules/success.path/success.path.route';
import { BootCampCourses } from '../app/modules/bootCamp/bootcamp.route';
import { FeedBackRoute } from '../app/modules/feedBackAndtermAndCondition/feedbackRoute';
import { TermsAndConditionRoute } from '../app/modules/feedBackAndtermAndCondition/termsAndConditionRoute';

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
    path: '/dashboard',
    route: DashboardRoute,
  },
  {
    path: '/small/business',
    route: SamllBusinessRoute,
  },
  {
    path: '/business/plan',
    route: BusinessPlanRoutes,
  },
  {
    path: '/success/path',
    route: SuccessPathRoutes,
  },
  {
    path: '/mock/interview',
    route: MockInterviewRoutes,
  },
  {
    path: '/bootcamp',
    route: BootcampRouter,
  },
  {
    path: '/bootcamp/courses',
    route: BootCampCourses,
  },
  {
    path: '/coaching',
    route: CoachingRoutes,
  },
  {
    path: '/groups',
    route: CommunityRoutes,
  },
  {
    path: '/notification',
    route: NotificationRoutes,
  },
  {
    path: '/feedback',
    route: FeedBackRoute,
  },
  {
    path: '/terms-condition',
    route: TermsAndConditionRoute,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
