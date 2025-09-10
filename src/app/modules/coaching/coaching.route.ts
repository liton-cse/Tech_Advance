import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { CoachingControllers } from './coaching.controller';
const router = express.Router();

router.post(
  '/',
  //   auth(USER_ROLES.USER),
  CoachingControllers.createUserController
);
router.put(
  '/status/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.updateSlotStatusController
);

router.get(
  '/search',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.getAllUsersSearchController
);
router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.getUsersController
);
router.put(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.updateUserController
);
router.delete(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.deleteUserController
);

export const CoachingRoutes = router;
