//UNICA CAPA QUE HABLA CON POSTGRE
import { pool } from "../config/pool.config.js";

export async function getAllAuthors() {
    const { rows } = await pool.query(
        'SELECT id, name, email, bio, created_at FROM authors ORDER BY id'
    );
    return rows;
}

export async function getAuthorsById(id) {
    const { rows } = await pool.query(
        'SELECT id, name, email, bio, created_at FROM authors WHERE id = $1',
        [id]
    );
    return rows[0] ?? null;
}



export async function createAuthor({name, email, bio}) {
    `INSERT INTO authors (name, email, bio)`
}