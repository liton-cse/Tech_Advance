import { Router } from 'express';
import { CommunityController } from './community.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

// @Group Routes
router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  CommunityController.createGroup
);
router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  CommunityController.getGroups
);
export const GroupRoutes = router;

// @Post Routes
router.post(
  '/:groupId/posts',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  CommunityController.createPost
);
router.get(
  '/:groupId/posts',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  CommunityController.getPostsByGroup
);

// @Comment Routes
router.post(
  '/:groupId/post/:postId/comments',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  CommunityController.createComment
);
// Reply to a comment
router.post(
  '/comments/:commentId/replies',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  CommunityController.replyToComment
);
router.get(
  '/:postId/comments',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  CommunityController.getCommentsByPost
);

// Top-level comment
router.put(
  '/comments/:commentId',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  CommunityController.updateComment
);
router.delete(
  '/comments/:commentId',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  CommunityController.removeComment
);

// Reply inside comment
router.put(
  '/comments/:commentId/replies/:replyId',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  CommunityController.updateReply
);
router.delete(
  '/comments/:commentId/replies/:replyId',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  CommunityController.removeReply
);

export const CommunityRoutes = router;
