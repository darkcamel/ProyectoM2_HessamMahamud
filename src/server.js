//ESTE MODULO SE ENCAREGA DE CREAR Y CONFIGURAR EL SERVIDRO

import express from 'express';
import { authorsRouter } from './routes/authors.route.js';
import loadEnvFile from 'node:process';
process.loadEnvFile('.env');
/* import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
 */
export const app = express();
/* const swaggerDocument = YAML.load('/openapi.yaml'); */

app.use(express.json());
app.use(authorsRouter);
/* app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); */
