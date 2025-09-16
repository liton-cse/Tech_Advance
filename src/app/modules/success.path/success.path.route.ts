import { Router } from 'express';
import { SuccessPathController } from './success.path.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

// Add question under a category
router.post(
  '/:categoryName',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.addQuizQuestion
);

// Get all categories
router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.getAllCategories
);

// Get one category by name
router.get(
  '/:categoryName',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.getCategoryByName
);

// Update question inside a category
router.put(
  '/:categoryName/:questionId',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.updateQuizQuestion
);

// Delete question inside a category
router.delete(
  '/:categoryName/:questionId',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.deleteQuizQuestion
);

export const SuccessPathRoutes = router;
