import { Router } from 'express';
import { getCommentsForPost, postComment } from '../controllers/comments.controller.js'; 
import { asyncHandler } from '../middleware/async-handler.js';

export const commentsRouter = Router();

commentsRouter.get('/posts/:postId/comments', asyncHandler(getCommentsForPost));
commentsRouter.post('/comments', asyncHandler(postComment));