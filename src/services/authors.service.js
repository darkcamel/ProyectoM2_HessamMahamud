//UNICA CAPA QUE HABLA CON POSTGRE
import { pool } from "../config/pool.config.js";

export async function getAllAuthors() {
    const { rows } = await pool.query(
        'SELECT id, name, email, bio, created_at FROM authors ORDER BY id'
    );
    return rows;
}

export async function getAuthorById(id) {
    const { rows } = await pool.query(
        'SELECT id, name, email, bio, created_at FROM authors WHERE id = $1',
        [id]
    );
    return rows[0] ?? null;
}

export async function findAuthorByEmail(email) {
    const { rows } = await pool.query(
        'SELECT id FROM authors WHERE email = $1',
        [email]
    );
    return rows[0] ?? null;
}

export async function createAuthor({ name, email, bio }) {
  const { rows } = await pool.query(
    `INSERT INTO authors (name, email, bio)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, bio, created_at`,
    [name, email, bio ?? null]
  );
  return rows[0];
}

export async function updateAuthor(id, { name, email, bio }) {
  const { rows } = await pool.query(
    `UPDATE authors
     SET name = $1, email = $2, bio = $3
     WHERE id = $4
     RETURNING id, name, email, bio, created_at`,
    [name, email, bio ?? null, id]
  );
  return rows[0] ?? null;
}

export async function deleteAuthor(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM authors WHERE id = $1',
    [id]
  );
  return rowCount > 0;
}