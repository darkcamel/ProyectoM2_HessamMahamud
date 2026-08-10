import { Router } from "express";
import {
    listAuthors,
    getAuthor,
    postAuthor,
    putAuthor,
    removeAuthor
} from '../controllers/authors.controller.js'
import { asyncHandler } from "../middleware/async-handler.js";

export const authorsRouter = Router();

authorsRouter.get('/authors', asyncHandler(listAuthors));
authorsRouter.get('/authors/:id', asyncHandler(getAuthor));
authorsRouter.post('/authors', asyncHandler(postAuthor));
authorsRouter.put('/authors/:id', asyncHandler(putAuthor));
authorsRouter.delete('/authors/:id', asyncHandler(removeAuthor));