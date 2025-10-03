import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import sdsd from './modules/caixa/caixa.routes.js'

/* --------------------------- importção de rotas --------------------------- */
import { funcionariosRoutes } from './modules'

/* ------------------------- configurações iniciais ------------------------- */
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

/* ------------------------------- middlewares ------------------------------ */
app.use(express.json());

// middleware global de tratamento de erros
app.use((err, req, res, next) => {
    res.status(500).json({ mensagem: err.messagem });
});

// serve pra salvar cookies
app.use(cookieParser());

// serve pra permitir requisições de outras origens
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true,
}));

/* ------------------------------- rotas ------------------------------- */
app.get('/', (req, res) => {
    res.status(200).send('<h1>API rodando</h1>');
});

app.use('/funcionarios', funcionariosRoutes);

app.listen(port, () => {
    console.log(`API rodando em: http://localhost:${port}`);
});
