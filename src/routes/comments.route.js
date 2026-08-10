import { Router } from "express";
import { getCommentsForPost, postComment } from "../controllers/comments.controller.js"; 

export const commentsRouter = Router();

commentsRouter.get('/posts/:postId/comments', getCommentsForPost);
commentsRouter.post('/comments', postComment);