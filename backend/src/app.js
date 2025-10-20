import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

/* -------------------------------------------------------------------------- */
/*                            Importação de rotas                             */
/* -------------------------------------------------------------------------- */
import {
    lojasRoutes, funcionariosRoutes, usuariosRoutes, produtosRoutes,
    precosRoutes, estoqueRoutes, fornecedoresRoutes, fornecedorProdutosRoutes,
    vendasRoutes, vendaItensRoutes, vendaPagamentosRoutes, caixaRoutes,

    authRotas
} from './modules/index.js';

/* -------------------------------------------------------------------------- */
/*                         Configurações iniciais                             */
/* -------------------------------------------------------------------------- */
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

/* -------------------------------------------------------------------------- */
/*                               Middlewares                                  */
/* -------------------------------------------------------------------------- */
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

/* ------------------- Middleware global de tratamento de erros -------------- */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensagem: err.message || 'Erro interno do servidor' });
});

/* -------------------------------------------------------------------------- */
/*                                   Rotas                                    */
/* -------------------------------------------------------------------------- */
app.get('/', (req, res) => {
    res.status(200).send('<h1>API rodando</h1>');
});

app.use('/lojas', lojasRoutes);
app.use('/funcionarios', funcionariosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/produtos', produtosRoutes);
app.use('/precos', precosRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/fornecedores', fornecedoresRoutes);
app.use('/fornecedor-produtos', fornecedorProdutosRoutes);
app.use('/vendas', vendasRoutes);
app.use('/venda-itens', vendaItensRoutes);
app.use('/venda-pagamentos', vendaPagamentosRoutes);
app.use('/caixa', caixaRoutes);

// auth
app.use('/auth', authRotas);

/* -------------------------------------------------------------------------- */
/*                                Inicialização                               */
/* -------------------------------------------------------------------------- */
app.listen(port, () => {
    console.log(`✅ API rodando em: http://localhost:${port}`);
});
