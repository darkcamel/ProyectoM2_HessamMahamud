import { pool } from './config.js';

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