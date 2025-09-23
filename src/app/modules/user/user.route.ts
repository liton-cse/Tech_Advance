import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { AuthValidation } from '../auth/auth.validation';
import { AuthController } from '../auth/auth.controller';
const router = express.Router();

router
  .route('/profile')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    UserController.getUserProfile
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.updateUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.updateProfile(req, res, next);
    }
  );

router.post(
  '/login',
  validateRequest(AuthValidation.createLoginZodSchema),
  AuthController.loginUser
);

router
  .route('/')
  .post(
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser
  );
router
  .route('/total-user')
  .get(auth(USER_ROLES.SUPER_ADMIN), UserController.totalUsers);
router
  .route('/search')
  .get(auth(USER_ROLES.SUPER_ADMIN), UserController.searchUsers);
router
  .route('/filter')
  .get(auth(USER_ROLES.SUPER_ADMIN), UserController.filterUsers);

router
  .route('/all')
  .get(auth(USER_ROLES.SUPER_ADMIN), UserController.getAllUserProfile);

router.patch(
  '/block/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.blockUser
);
router.patch(
  '/unblock/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.unblockUser
);
router.get(
  '/blocked',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.getBlockedUsers
);

export const UserRoutes = router;
