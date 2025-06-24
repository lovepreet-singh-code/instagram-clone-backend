import express from 'express';
import { createPost,
    getAllPosts,
    getPostsByUser,
  updatePost,
  deletePost
 } from '../controllers/post.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Protected Route: Create Post
router.post('/posts', authenticate, createPost);
router.get('/posts', getAllPosts); // all posts
router.get('/posts/user/:userId', getPostsByUser); // user-specific posts
router.put('/posts/:id', authenticate, updatePost);
router.delete('/posts/:id', authenticate, deletePost);



export default router;
