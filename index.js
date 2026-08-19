//ESTE MODULO SE ENCARGA SOLO DE LEVANTAR EL SERVIDOR
if (process.env.NODE_ENV !== 'production') {
    process.loadEnvFile('.env');
}

import { app } from './src/server.js';

app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
});
