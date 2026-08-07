import { pool } from '../config/pool.config.js';

export async function getCommentsByPostId(postId) {
    const { rows } = await pool.query(
        'SELECT id, post_id, author_id, content, created_at FROM comments WHERE post_id = $1',
        [postId]
    );
    return rows;
}

export async function createComment({ post_id, author_id, content }) {
    const { rows } = await pool.query(
        `INSERT INTO comments (post_id, author_id, content)
        VALUES ($1, $2, $3)
        RETURNING id, post_id, author_id, content, created_at`,
        [post_id, author_id, content]
    );
    return rows[0];
}