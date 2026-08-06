import { pool } from '../config/pool.config.js';

export async function getAllPosts() {
    const { rows } = await pool.query(
        'SELECT id, title, content, author_id, published, created_at FROM posts ORDER BY id'
    );
    return rows;
}

export async function getPostById(id) {
    const { rows } = await pool.query(
        'SELECT id, title, content, author_id, published, created_at FROM posts WHERE id = $1',
        [id]
    );
    return rows[0] ?? null;
}

export async function getPostsByAuthorId(authorId) {
    const { rows } = await pool.query(
        'SELECT id, title, content, author_id, published, created_at FROM posts WHERE author_id = $1',
        [authorId]
    );
    return rows;
}

export async function createPost({ title, content, authorId, published }) {
    const { rows } = await pool.query(
        `INSERT INTO posts (title, content, author_id, published)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, content, published, created_at`,
        [title, content, authorId, published ?? false]
    );
    return rows[0];
}

export async function updatePost(id, { title, content, authorId, published }) {
    const { rows } = await pool.query(
        `UPDATE posts
        SET title = $1, content = $2, author_id = $3, published = $4
        WHERE id = $5
        RETURNING id, title, content, published`,
        [title, content, published ?? false, id]
    );
    return rows[0] ?? null;
}

export async function deletePost(id) {
    const { rowCount } = await pool.query(
        'DELETE FROM posts WHERE id = $1',
        [id]
    );
    return rowCount > 0;  
}