import { Pool } from 'pg';

const configPool = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: parseInt(process.env.DB_MAX, 10) || 10,
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MILLIS, 10) || 30000,
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MILLIS, 10) || 2000
};

export const pool = new Pool(configPool);
