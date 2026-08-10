//ESTE MODULO SE ENCARGA SOLO DE LEVANTAR EL SERVIDOR

import { app } from './src/server.js';

if (process.env.NODE_ENV !== 'production') {
    process.loadEnvFile('.env');
}

app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
});