//ESTE MODULO SE ENCARGA SOLO DE LEVANTAR EL SERVIDOR
import { app } from './src/server.js';
/* import loadEnvFile from 'node:process';
process.loadEnvFile('.env'); */

app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
});

/* if (process.env.NODE_ENV !== 'production') {
    loadEnvFile('.env');
} */