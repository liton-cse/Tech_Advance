import express from 'express';
import {
  AssessmentController,
  SamllBusinessController,
} from './small.business.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

// CRUD for questions scoped to static categories
router.post(
  '/:categoryName/questions',
  auth(USER_ROLES.SUPER_ADMIN),
  SamllBusinessController.addQuestion
);
router.get(
  '/:categoryName/questions',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  SamllBusinessController.getQuestionsByCategory
);
router.get(
  '/:categoryName/questions/:questionId',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  SamllBusinessController.getQuestionById
);
router.put(
  '/:categoryName/questions/:questionId',
  auth(USER_ROLES.SUPER_ADMIN),
  SamllBusinessController.updateQuestion
);
router.delete(
  '/:categoryName/questions/:questionId',
  auth(USER_ROLES.SUPER_ADMIN),
  SamllBusinessController.deleteQuestion
);

// @assesment route.
//-----------Get Assessment by range-------
// GET /api/assessments/range?value=11
router.get(
  '/assessments/by-range',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  AssessmentController.getAssessmentByRangeSmallBusiness
);

router.post(
  '/assessments',
  auth(USER_ROLES.SUPER_ADMIN),
  AssessmentController.createAssessment
);
router.get(
  '/assessments',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  AssessmentController.getAllAssessments
);
router.get(
  '/assessments/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  AssessmentController.getAssessmentById
);
router.put(
  '/assessments/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  AssessmentController.updateAssessment
);
router.delete(
  '/assessments/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  AssessmentController.deleteAssessment
);

export const SamllBusinessRoute = router;
