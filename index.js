pool.query('SELECT NOW()')
    .then(() => console.log('postgreSQL conectado correctamente'))
    .catch((error) => {
        console.error('error conectado a PostgresSQL:', error.message);
        process.exit(1);
    });