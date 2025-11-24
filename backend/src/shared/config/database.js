import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega o .env do diretório raiz do backend
dotenv.config({ path: resolve(__dirname, '../../../.env') });

// Verifica se a DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não encontrada no arquivo .env');
    console.error('Caminho esperado:', resolve(__dirname, '../../../.env'));
    process.exit(1);
}

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Testa a conexão
prisma.$connect()
    .then(() => {
        console.log('✅ Prisma conectado ao banco de dados');
    })
    .catch((err) => {
        console.error('❌ Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    });

export default prisma;