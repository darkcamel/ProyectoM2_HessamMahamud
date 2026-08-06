import {
    getAllPosts,
    getPostById,
    getPostsByAuthorId,
    createPost,
    updatePost,
    deletePost
} from "../services/posts.service.js";
import { getAuthorById } from "../services/authors.service.js";

export async function listPosts(req, res) {
    const posts = await getAllPosts();
    res.status(200).json(posts);
}

export async function getPost(req, res) {
    const post = await getPostById(req.params.id);
    if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(200).json(post);
}

export async function getPostsByAuthor(req, res) {
    const { authorId } = req.params;

    const author = await getAuthorById(authorId);
    if (!author) {
        return res.status(404).json({ error: 'Author no encontrado' });
    }

    const posts = await getPostsByAuthorId(authorId);
    res.status(200).json(posts);
}

export async function postPost(req, res) {
    const { title, content, author_id, published } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title es requerido' });
    }

    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Content es requerido' });
    }

    if (!author_id) {
        return res.status(400).json({ error: 'Author_id es requerido' });
    }

    const existing = await getAuthorById(author_id);
    if (!existing) {
        return res.status(400).json({ error: 'Author_id no corresponde a un author existente' });
    }

    try {
        const post = await createPost({ title, content, author_id, published });
        res.status(201).json(post);
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ error: 'Author_id no corresponde a un author existente' });
        }
        throw error;
    }
}

export async function putPost(req, res) {
    const { title, content, author_id, published } = req.body;
    const { id } = req.params;

    const post = await getPostById(req.params.id);
    if (!post) {
        return res.status(404).json({ error: 'Post no encontrado'})
    }

    if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title es requerido' });
    }

    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Content es requerido' });
    }

    if (!author_id) {
        return res.status(400).json({ error: 'Author_id es requerido' });
    }

    const existing = await getAuthorById(author_id);
    if (!existing) {
        return res.status(400).json({ error: 'Author_id no corresponde a un author existente' });
    }

    try {
        const updated = await updatePost(id, { title, content, author_id, published });
        if (!updated) {
            return res.status(404).json({ error: 'Post no encontrado'});
        }
        res.status(200).json(updated);
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ error: 'Author_id no corresponde a un author existente'})
        }
        throw error;
    }
}

export async function removePost(req, res) {
    const deleted = await deletePost(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(204).send();
}