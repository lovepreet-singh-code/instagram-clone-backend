
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User, IUser } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { STATUS } from '../constants/statusCodes';
import { MSG } from '../constants/messages';

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) throw new Error(MSG.USER_NOT_FOUND);

  res.status(STATUS.OK).json(user);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select('-password');
  res.status(STATUS.OK).json({ message: MSG.PROFILE_UPDATE_SUCCESS, user });
});

export const followUser = asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = new mongoose.Types.ObjectId(req.userId as string);
  const targetUserId = new mongoose.Types.ObjectId(req.params.id);

  const target = await User.findById(targetUserId) as (IUser & { _id: mongoose.Types.ObjectId });
  const current = await User.findById(currentUserId) as (IUser & { _id: mongoose.Types.ObjectId });

  if (!target || !current) throw new Error(MSG.USER_NOT_FOUND);

  const alreadyFollowing = target.followers.map((id: mongoose.Types.ObjectId) => id.toString()).includes(current._id.toString());

  if (!alreadyFollowing) {
    target.followers.push(current._id);
    current.following.push(target._id as mongoose.Types.ObjectId);

    await target.save();
    await current.save();
  }

  res.status(STATUS.OK).json({ message: MSG.FOLLOW_SUCCESS });
});

export const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = new mongoose.Types.ObjectId(req.userId as string);
  const targetUserId = new mongoose.Types.ObjectId(req.params.id);

  const target = await User.findById(targetUserId) as (IUser & { _id: mongoose.Types.ObjectId });
  const current = await User.findById(currentUserId) as (IUser & { _id: mongoose.Types.ObjectId });

  if (!target || !current) throw new Error(MSG.USER_NOT_FOUND);

  target.followers = target.followers.filter(
    (id) => id.toString() !== current._id.toString()
  );
  current.following = current.following.filter(
    (id) => id.toString() !== target._id.toString()
  );

  await target.save();
  await current.save();

  res.status(STATUS.OK).json({ message: MSG.UNFOLLOW_SUCCESS });
});
