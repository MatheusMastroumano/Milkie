import { fa } from 'zod/locales';
import prisma from '../../shared/config/database.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getProdutos() {
    try {
        return await prisma.produtos.findMany();
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getProdutosById(id) {
    try {
        return await prisma.produtos.findUnique({
            where: { id: id },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createProdutos(data) {
    const { nome, marca, categoria, descricao, sku, fabricacao, validade, ativo } = data;

    if (fabricacao > validade) {
        throw new Error('Data de fabricação inválida.');
    }

    if (validade < new Date()) {
        throw new Error('Data de validade inválida.');
    }

    if (ativo !== true || ativo !== false) {
        throw new Error('Ativo inválido.');
    }

    try {
        return await prisma.produtos.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateProdutos(id, data) {
    const { nome, marca, categoria, descricao, sku, fabricacao, validade, ativo } = data;

    if (ativo !== true || ativo !== false) {
        throw new Error('Ativo inválido.');
    }

    try {
        return await prisma.produtos.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeProdutos(id) {
    try {
        return await prisma.produtos.delete({
            where: { id: id },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}