import { Router } from "express";
import {
    listPosts,
    getPost,
    getPostsByAuthor,
    postPost,
    putPost,
    removePost
} from "../controllers/posts.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";

export const postsRouter = Router();

postsRouter.get('/posts', asyncHandler(listPosts));
postsRouter.get('/posts/author/:authorId', asyncHandler(getPostsByAuthor));
postsRouter.get('/posts/:id', asyncHandler(getPost));
postsRouter.post('/posts', asyncHandler(postPost));
postsRouter.put('/posts/:id', asyncHandler(putPost));
postsRouter.delete('/posts/:id', asyncHandler(removePost));