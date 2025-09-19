import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { CoachingControllers } from './coaching.controller';
const router = express.Router();

router.post(
  '/user',
  auth(USER_ROLES.USER),
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
  '/user',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.getUsersController
);

router.get(
  '/total-users',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.totalCoachingUsers
);

router.get(
  '/approved/total-users',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.totalApprovedCoachingUsers
);

router.get(
  '/denied/total-users',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.totalDeniedCoachingUsers
);

router.get(
  '/user/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.getUsersControllerById
);
router.put(
  '/user/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.updateUserController
);
router.delete(
  '/user/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.deleteUserController
);

//----------Coach for Coaching---------

// Coach CRUD
router.post(
  '/coach',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.createCoach
);
router.put(
  '/coach/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.updateCoach
);
router.delete(
  '/coach/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.deleteCoach
);
router.get(
  '/coach',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.getAllCoaches
);
router.get(
  '/coach/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.getCoachById
);

// Date & Slot Management
router.post(
  '/coach/:id/date',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.addDate
); // add date (auto slots)
router.put(
  '/coach/:id/slot',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.updateSlot
); // update slot
router.put(
  '/coach/:coachId/toggle-slot-flag',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.toggleSlotFlagController
);
router.delete(
  '/coach/:id/slot',
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.deleteSlot
); // delete slot
router.get(
  '/coach/:id/slots', //coachId=id
  auth(USER_ROLES.SUPER_ADMIN),
  CoachingControllers.getSlotsByDate
); // get slots for a date

export const CoachingRoutes = router;
