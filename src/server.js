//ESTE MODULO SE ENCAREGA DE CREAR Y CONFIGURAR EL SERVIDRO

import express from 'express';
import { authorsRouter } from './routes/authors.route.js';

export const app = express();


app.use(express.json());
app.use(authorsRouter);

/* await pool.query('SELECT NOW()')
    .then(() => console.log('PostgreSQL conectado correctamente'))
    .catch((error) => {
        console.error('Error conectado a PostgresSQL:', error.message);
        process.exit(1);
    });

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW() AS hora_actual');
        console.log('Conexión exitosa a PostgreSQL');
        console.log('Hora del servidor:', result.rows[0].hora_actual);

        const tables = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        `);
        console.log('Tablas encontradas:', tables.rows.map(r => r.table_name));
        await pool.end();

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

testConnection(); */