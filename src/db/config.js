process.loadEnvFile('.env');

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW()')
    .then(() => console.log('postgreSQL conectado correctamente'))
    .catch((error) => {
        console.error('error conectado a PostgresSQL:', error.message);
        process.exit(1);
    });

module.exports = pool;