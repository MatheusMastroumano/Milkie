import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import verificarPalavroes from './shared/middlewares/verificarPalavroes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* -------------------------------------------------------------------------- */
/*                         Configurações iniciais                             */
/* -------------------------------------------------------------------------- */

const app = express();
const port = process.env.PORT || 8080;

/* -------------------------------------------------------------------------- */
/*                            Importação de rotas                             */
/* -------------------------------------------------------------------------- */
import {
    lojasRoutes,              funcionariosRoutes, usuariosRoutes, 
    produtosRoutes,           estoqueRoutes,      fornecedoresRoutes,
    fornecedorProdutosRoutes, vendasRoutes,       vendaItensRoutes, 
    vendaPagamentosRoutes,    caixaRoutes,
    despesasRoutes,           pagamentosFornecedoresRoutes,
    pagamentosFuncionariosRoutes,

    authRotas
} from './modules/index.js';
import { finalizarVendaController } from './modules/vendas/vendas.controller.js';

/* -------------------------------------------------------------------------- */
/*                               Middlewares                                  */
/* -------------------------------------------------------------------------- */
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
        const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
        if (isDev) {
            // Em desenvolvimento, permite qualquer origem para facilitar testes locais
            return callback(null, true);
        }
        if (!origin || origin === allowedOrigin) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(verificarPalavroes);

// Servir arquivos estáticos (imagens) - DEVE estar DEPOIS do CORS
// __dirname aponta para backend/src, então precisamos subir um nível para backend
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res) => {
        // Configurar headers apropriados para imagens
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
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
app.use('/estoque', estoqueRoutes);
app.use('/fornecedores', fornecedoresRoutes);
app.use('/fornecedor-produtos', fornecedorProdutosRoutes);
app.post('/vendas/finalizar', finalizarVendaController);
app.use('/vendas', vendasRoutes);
app.use('/venda-itens', vendaItensRoutes);
app.use('/venda-pagamentos', vendaPagamentosRoutes);
app.use('/caixa', caixaRoutes);
app.use('/despesas', despesasRoutes);
app.use('/pagamentos-fornecedores', pagamentosFornecedoresRoutes);
app.use('/pagamentos-funcionarios', pagamentosFuncionariosRoutes);

// auth
app.use('/auth', authRotas);

/* -------------------------------------------------------------------------- */
/*                                Inicialização                               */
/* -------------------------------------------------------------------------- */
app.listen(port, () => {
    console.log(`✅ API rodando em: http://localhost:${port}`);
});
