import express from 'express';
import * as CourseController from './bootcamp.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

// ====== COURSES ======
router.post('/', auth(USER_ROLES.SUPER_ADMIN), CourseController.createCourse);
router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  CourseController.getAllCourses
);
router.get(
  '/:courseId',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  CourseController.getCourseById
);
router.patch(
  '/:courseId',
  auth(USER_ROLES.SUPER_ADMIN),
  CourseController.updateCourseName
);
router.delete(
  '/:courseId',
  auth(USER_ROLES.SUPER_ADMIN),
  CourseController.deleteCourse
);

// ====== MODULES ======
router.post(
  '/:courseId/modules',
  auth(USER_ROLES.SUPER_ADMIN),
  CourseController.addModuleToCourse
);
router.get(
  '/:courseId/modules',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  CourseController.getModuleFromCourse
);

router.patch(
  '/:courseId/modules/:moduleId',
  auth(USER_ROLES.SUPER_ADMIN),
  CourseController.updateModuleName
);
router.delete(
  '/:courseId/modules/:moduleId',
  auth(USER_ROLES.SUPER_ADMIN),
  CourseController.deleteModule
);

// ====== CONTENT ======
router.post(
  '/:courseId/modules/:moduleId/contents',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  CourseController.addContentToModule
);
router.post(
  '/:courseId/modules/:moduleId/videos',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  CourseController.addVideoToModule
);

router.get(
  '/:courseId/modules/:moduleId/contents',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  CourseController.getContentFromModule
);

router.patch(
  '/:courseId/modules/:moduleId/contents/:contentId',
  auth(USER_ROLES.SUPER_ADMIN),
  CourseController.updateContentTitle
);
router.delete(
  '/:courseId/modules/:moduleId/contents/:contentId',
  auth(USER_ROLES.SUPER_ADMIN),
  CourseController.deleteContent
);

export const BootCampCourses = router;
