import express from 'express';
import { MockInterviewController } from './quiz.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

//---------Quiz--------
router.post(
  '/quiz',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.createQuiz
);
router.get(
  '/quiz',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.getQuizzes
);
router.put(
  '/quiz/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.updateQuiz
);
router.delete(
  '/quiz/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.deleteQuiz
);

//------------Assessment-----------
// @ /api/v1/mock/interview/assessments/by-range?value=5
router.get(
  '/assessments/by-range',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.getAssessmentByRangeMockInterview
);

router.post(
  '/assessments',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.createAssessment
);
router.get(
  '/assessments',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.getAllAssessments
);
router.get(
  '/assessments/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.getAssessmentById
);
router.put(
  '/assessments/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.updateAssessment
);
router.delete(
  '/assessments/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  MockInterviewController.deleteAssessment
);

export const MockInterviewRoutes = router;
