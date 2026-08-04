//ESTE MODULO SE ENCAREGA DE CREAR Y CONFIGURAR EL SERVIDRO

import express from 'express';
import { router } from './routes/authors.route.js';

export const app = express();


app.use(express.json);
app.use(router);