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