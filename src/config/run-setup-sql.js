import { readFileSync } from 'node:fs';
import { pool } from './pool.config.js';

const sql = readFileSync(new URL('./setup.sql', import.meta.url), 'utf-8');

try {
    await pool.query(sql);
    console.log('Tablas creadas correctamente');

} catch (error) {
    console.error('Error ejectuando setup.sql', error.message);
    
} finally {
    await pool.end();
}

//npm run db:setup desde terminal para correr setup.sql y crear tablas.