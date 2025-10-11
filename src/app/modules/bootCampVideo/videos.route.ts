import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { VideoController } from './videos.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/videos',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  VideoController.createVideo
);

router.get(
  '/videos',
  auth(USER_ROLES.SUPER_ADMIN),
  VideoController.getAllVideos
);

router.get(
  '/videos/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  VideoController.getVideo
);
router.put(
  '/videos/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  VideoController.updateVideo
);
router.delete(
  '/videos/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  VideoController.deleteVideo
);

// ----------------- PLAYLIST ROUTES -----------------
router.post(
  '/playlists',
  auth(USER_ROLES.SUPER_ADMIN),
  VideoController.addPlaylist
);
router.get(
  '/playlists',
  auth(USER_ROLES.SUPER_ADMIN),
  VideoController.getAllPlaylists
);
router.get(
  '/playlists/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  VideoController.getPlaylistById
);
router.put(
  '/playlists/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  VideoController.updatePlaylist
);
router.delete(
  '/playlists/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  VideoController.deletePlaylist
);

// Add video to playlist
router.post(
  '/playlists/:playlistId/videos',
  // auth(USER_ROLES.SUPER_ADMIN),
  VideoController.addVideoToPlaylist
);

export const BootcampRouter = router;
