process.loadEnvFile('.env');

const { Pool } = require('pg');

const configPool = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: process.env.DB_MAX,
    idleTimeoutMillis: process.env.DB_idleTimeoutMillis,
    connectionTimeoutMillis: process.env.DB_connectionTimeoutMillis
};

const pool = new Pool(configPool);

module.exports = pool;