import { getCommentsByPostId, createComment } from "../services/comments.service.js";
import { getAuthorById } from "../services/authors.service.js";
import { getPostById } from "../services/posts.service.js";

export async function getCommentsForPost(req, res) {
    const { postId } = req.params;

    const post = await getPostById(postId);
    if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
    }

    const comment = await getCommentsByPostId(postId);
    res.status(200).json(comment);
}

export async function postComment(req, res) {
    const { post_id, author_id, content } = req.body;

    if (!post_id) {
        return res.status(400).json({ error: 'Post_id es requerido' });
    }

    if (!author_id) {
        return res.status(400).json({ error: 'Author_id es requerido' });
    }

    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Content es requerido' });
    }

    const existingAuthor = await getAuthorById(author_id);
    if (!existingAuthor) {
        return res.status(400).json({ error: 'Author_id no corresponde a un author existente' });
    }

    const existingPost = await getPostById(post_id);
    if (!existingPost) {
        return res.status(400).json({ error: 'Post_id no corresponde a un post existente' });
    }

    try {
        const comment = await createComment({ post_id, author_id, content });
        res.status(201).json(comment);
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ error: 'Post_id o Author_id no corresponde a registros existentes' });
        }
        throw error;
    }
}