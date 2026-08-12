import { readFileSync } from 'node:fs';
import { pool } from './pool.config.js';

const sql = readFileSync(new URL('../db/seed.sql', import.meta.url), 'utf-8');

try {
    await pool.query(sql);
    console.log('Datos de ejemplo insertados correctamente');

} catch (error) {
    console.error('Error ejecutando seed.sql', error.message);
    
} finally {
    await pool.end();
}