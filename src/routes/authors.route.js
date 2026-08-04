import { Router } from "express";
import {
    listAuthors,
    getAuthor,
    postAuthor,
    putAuthor,
    removeAuthor
} from '../controllers/authors.controller.js'

export const authorsRouter = Router();

authorsRouter.get('/authors', listAuthors);
authorsRouter.get('/authors/:id', getAuthor);
authorsRouter.post('/authors', postAuthor);
authorsRouter.put('/authors/:id', putAuthor);
authorsRouter.delete('/authors/:id', removeAuthor);