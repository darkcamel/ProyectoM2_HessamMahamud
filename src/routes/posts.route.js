import { Router } from "express";
import {
    listPosts,
    getPost,
    getPostsByAuthor,
    postPost,
    putPost,
    removePost
} from "../controllers/posts.controller.js";

export const postsRouter = Router();

postsRouter.get('/posts', listPosts);
postsRouter.get('/posts/author/:authorId', getPostsByAuthor);
postsRouter.get('/posts/:id', getPost);
postsRouter.post('/posts', postPost);
postsRouter.put('/posts/:id', putPost);
postsRouter.delete('/posts/:id', removePost);