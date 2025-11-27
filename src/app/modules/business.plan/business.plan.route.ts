import { Router } from 'express';
import {
  BusinessPlanController,
  QuestionController,
  QuizController,
} from './business.plam.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { generatePdf } from './business.plan.pdf';
const router = Router();

router.post('/quiz', auth(USER_ROLES.SUPER_ADMIN), QuizController.createQuiz);
router.get(
  '/quiz',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  QuizController.getAllQuizs
);
router.get(
  '/quiz/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  QuizController.getQuizById
);
router.put(
  '/quiz/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  QuizController.updateQuiz
);
router.delete(
  '/quiz/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  QuizController.deleteQuiz
);

// @business paln question route.
router.post(
  '/question',
  auth(USER_ROLES.SUPER_ADMIN),
  QuestionController.addQuestion
);
router.get(
  '/question',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  QuestionController.getAllQuestions
);
router.get(
  '/question/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  QuestionController.getQuestionById
);
router.put(
  '/question/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  QuestionController.updateQuestion
);
router.delete(
  '/question/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  QuestionController.deleteQuestion
);

// Submit quiz + question responses
// POST /api/responses
router.post(
  '/responses',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  BusinessPlanController.BusinessPlanPdf
);

// Generate PDF based on submitted answers
// GET /api/responses/:userId/pdf
router.get(
  '/responses/pdf',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  generatePdf
);

export const BusinessPlanRoutes = router;
