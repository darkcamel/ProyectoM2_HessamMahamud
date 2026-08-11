//ESTE MODULO SE ENCAREGA DE CREAR Y CONFIGURAR EL SERVIDRO

import express from 'express';
import { authorsRouter } from './routes/authors.route.js';
import { postsRouter } from './routes/posts.route.js';
import { commentsRouter } from './routes/comments.route.js';
import { errorHandler } from './middleware/error-handler.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { AppError } from './utils/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();
const swaggerDocument = YAML.load(join(__dirname, '../src/docs/swagger.yaml'));

app.use(express.json());
app.use(authorsRouter);
app.use(postsRouter);
app.use(commentsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
    next(new AppError('Ruta no encontrada', 404));
});
app.use(errorHandler);