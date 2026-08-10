import {
    getAllPosts,
    getPostById,
    getPostsByAuthorId,
    createPost,
    updatePost,
    deletePost
} from '../services/posts.service.js';
import { getAuthorById } from '../services/authors.service.js';
import { AppError } from '../utils/AppError.js';

export async function listPosts(req, res, next) {
    try {
        const posts = await getAllPosts();
        res.status(200).json(posts)

    } catch (error) {
        next(error);
    }
}

export async function getPost(req, res, next) {
    try {
        const post = await getPostById(req.params.id);
        if (!post) {
            return next(new AppError('Post no encontrado', 404));
        }
        res.status(200).json(post)

    } catch (error) {
        next(error);
    }
}

export async function getPostsByAuthor(req, res, next) {
    const { authorId } = req.params;
    
    try {
        const author = await getAuthorById(authorId);
        if (!author) {
            return next(new AppError('Author no encontrado', 404));
        }
        const posts = await getPostsByAuthorId(authorId);
        res.status(200).json(posts)

    } catch (error) {
        next(error);
    }
}

export async function postPost(req, res, next) {
    const { title, content, author_id, published } = req.body;

    if (!title || !title.trim()) {
        return next(new AppError('Title es requerido', 400));
    }

    if (!content || !content.trim()) {
        return next(new AppError('Content es requerido', 400));
    }

    if (!author_id) {
        return next(new AppError('Author_id es requerido', 400));
    }

    try {
        const existing = await getAuthorById(author_id);
        if (!existing) {
            return next(new AppError('Author_id no corresponde a un author existente', 400));
        }
        const post = await createPost({ title, content, author_id, published });
        res.status(201).json(post);

    } catch (error) {
        if (error.code === '23503') {
            return next(new AppError('Author_id no corresponde a un author existente', 400));
        }
        next(error);
    }
}

export async function putPost(req, res, next) {
    const { title, content, author_id, published } = req.body;
    const { id } = req.params;

    if (!title || !title.trim()) {
        return next(new AppError('Title es requerido', 400));
    }

    if (!content || !content.trim()) {
        return next(new AppError('Content es requerido', 400));
    }

    if (!author_id) {
        return next(new AppError('Author_id es requerido', 400));
    }

    try {
        const post = await getPostById(req.params.id);
        if (!post) {
            return next(new AppError('Post no encontrado', 404));
        }

        const author = await getAuthorById(author_id);
        if (!author) {
            return next(new AppError('Author_id no corresponde a un author existente', 400));
        }

        const updated = await updatePost(id, { title, content, author_id, published });
        if (!updated) {
            return next(new AppError('Post no encontrado', 404));
        }
        res.status(200).json(updated);

    } catch (error) {
        if (error.code === '23503') {
            return next(new AppError('Author_id no corresponde a un author existente', 400));
        }
        next(error);
    }
}

export async function removePost(req, res, next) {
    try {
        const deleted = await deletePost(req.params.id);
        if (!deleted) {
            return next(new AppError('Post no encontrado', 404));
        }
        res.status(204).send()

    } catch (error) {
        next(error);
    }
}