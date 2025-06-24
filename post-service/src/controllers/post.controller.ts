import { Request, Response } from 'express';
import { Post } from '../models/post.model';
import { asyncHandler } from '../utils/asyncHandler';

// Create new post
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { caption, mediaUrl } = req.body;

  if (!caption || !mediaUrl) {
    return res.status(400).json({ success: false, message: 'Caption and mediaUrl are required' });
  }

  const post = await Post.create({ caption, mediaUrl, userId });

  res.status(201).json({
    success: true,
    data: post,
  });
});

// Get all posts
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Post.find().sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    success: true,
    data: posts,
  });
});

// Get posts by specific user
export const getPostsByUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const posts = await Post.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: posts,
  });
});

// Update a post
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { caption, mediaUrl } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  if (post.userId.toString() !== req.userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized to update this post' });
  }

  post.caption = caption ?? post.caption;
  post.mediaUrl = mediaUrl ?? post.mediaUrl;
  await post.save();

  res.status(200).json({ success: true, data: post });
});

// Delete a post
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  if (post.userId.toString() !== req.userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized to delete this post' });
  }

  await post.deleteOne();
  res.status(200).json({ success: true, message: 'Post deleted successfully' });
});
