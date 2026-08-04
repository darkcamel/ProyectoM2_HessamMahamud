process.loadEnvFile('.env');
import { Pool } from 'pg';

const configPool = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: process.env.DB_MAX,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MILLIS,
    connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT_MILLIS
};

export const pool = new Pool(configPool);