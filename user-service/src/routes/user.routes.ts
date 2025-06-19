import express from 'express';
import {
  getMyProfile,
  updateProfile,
  followUser,
  unfollowUser,
} from '../controllers/user.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.patch('/update', protect, updateProfile);
router.patch('/follow/:id', protect, followUser);
router.patch('/unfollow/:id', protect, unfollowUser);

export default router;
