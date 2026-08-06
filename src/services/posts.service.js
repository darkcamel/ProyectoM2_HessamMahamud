import { pool } from '../config/pool.config.js';
import { getAuthorById } from './authors.service.js';

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

