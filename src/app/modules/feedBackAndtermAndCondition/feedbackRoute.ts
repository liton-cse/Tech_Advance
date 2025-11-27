import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { FeedBackAndTermsAndCondition } from './controller';

const router = Router();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  FeedBackAndTermsAndCondition.createFeedback
);

router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  FeedBackAndTermsAndCondition.getFeedbacks
);

router.delete(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  FeedBackAndTermsAndCondition.deleteFeedback
);

export const FeedBackRoute = router;
