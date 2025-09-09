import express from 'express';
import { QuizController } from './quiz.controller';
import validateRequest from '../../middlewares/validateRequest';
import { QuizValidation } from './quiz.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

router.post('/', auth(USER_ROLES.SUPER_ADMIN), QuizController.createQuiz);

router.get('/', auth(USER_ROLES.SUPER_ADMIN), QuizController.getQuizzes);
router.put('/:id', auth(USER_ROLES.SUPER_ADMIN), QuizController.updateQuiz);
router.delete('/:id', auth(USER_ROLES.SUPER_ADMIN), QuizController.deleteQuiz);

export const QuizRoutes = router;
