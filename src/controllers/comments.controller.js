import { getCommentsByPostId, createComment } from '../services/comments.service.js';
import { getAuthorById } from '../services/authors.service.js';
import { getPostById } from '../services/posts.service.js';
import { AppError } from '../utils/AppError.js';

export async function getCommentsForPost(req, res, next) {
    try {
        const { postId } = req.params;

        const post = await getPostById(postId);
        if (!post) {
            return next(new AppError('Post no encontrado', 404));
        }

        const comment = await getCommentsByPostId(postId);
        res.status(200).json(comment);

    } catch (error) {
        next(error);
    }
}

export async function postComment(req, res, next) {
    const { post_id, author_id, content } = req.body;

    if (!post_id) {
        return next(new AppError('Post_id es requerido', 400));
    }

    if (!author_id) {
        return next(new AppError('Author_id es requerido', 400));
    }

    if (!content || !content.trim()) {
        return next(new AppError('Content es requerido', 400));
    }

    try {
        const existingAuthor = await getAuthorById(author_id);
        if (!existingAuthor) {
            return next(new AppError('Author_id no corresponde a un author existente', 400));
        }

        const existingPost = await getPostById(post_id);
        if (!existingPost) {
            return next(new AppError('Post_id no corresponde a un post existente', 400));
        }

        const comment = await createComment({ post_id, author_id, content });
        res.status(201).json(comment);

    } catch (error) {
        if (error.code === '23503') {
            return next(new AppError('Post_id o Author_id no corresponde a registros existentes', 400));
        }
        next(error);
    }
}