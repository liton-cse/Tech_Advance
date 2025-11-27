import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { FeedBackAndTermsAndCondition } from './controller';

const router = Router();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN),
  FeedBackAndTermsAndCondition.createOrUpdateTerms
);

router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  FeedBackAndTermsAndCondition.getTerms
);

export const TermsAndConditionRoute = router;
