import prisma from '../../shared/config/database.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getFornecedorProdutos() {
    try {
        return await prisma.fornecedor_produtos.findMany({
            include: {
                fornecedor: true,
                produto: true
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getFornecedorProdutosById(id) {
    try {
        return await prisma.fornecedor_produtos.findUnique({
            where: { id: id },
            include :{
                fornecedor: true,
                produto: true
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createFornecedorProdutos(data) {
    try {
        return await prisma.fornecedor_produtos.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateFornecedorProdutos(id, data) {
    try {
        return await prisma.fornecedor_produtos.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeFornecedorProdutos(id) {
    try {
        return await prisma.fornecedor_produtos.delete({
            where: { id: id },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}