import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { VideoController } from './videos.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  VideoController.createVideo
);

router.get('/', auth(USER_ROLES.SUPER_ADMIN), VideoController.getAllVideos);

router.get('/:id', auth(USER_ROLES.SUPER_ADMIN), VideoController.getVideo);
router.put(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  VideoController.updateVideo
);
router.delete(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  VideoController.deleteVideo
);
export const VideoRouter = router;
