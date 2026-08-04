//Continuar viendo video clase: 2026-07-29

process.loadEnvFile('.env');
import express from 'express';
import { Router } from 'express';
import { pool } from './src/config/pool.config.js';

const app = express();
const router = Router();
/* const port = process.env.PORT; */ //Como ya está definido el puerto en .env y estoy cargando el archivo no es necesario volverlo a declarar como variable.

app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
});

app.use(express.json());
app.use(router);

await pool.query('SELECT NOW()')
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

testConnection();