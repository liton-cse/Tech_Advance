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

/**
 * Assessment.
 */
router.post(
  '/assessments/:categoryName',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.addAssessment
); // Create
router.get(
  '/assessments',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.getAllAssessmentCategories
); // Read all
router.get(
  '/assessments/:categoryName',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.getAssessmentCategoryByName
); // Read one
router.put(
  '/assessments/:categoryName/:assessmentId',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.updateAssessment
); // Update
router.delete(
  '/assessments/:categoryName/:assessmentId',
  auth(USER_ROLES.SUPER_ADMIN),
  SuccessPathController.deleteAssessment
); // Delete

export const SuccessPathRoutes = router;
