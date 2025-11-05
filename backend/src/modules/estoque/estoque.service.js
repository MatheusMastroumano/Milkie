import prisma from '../../shared/config/database.js';

/* ------------------------------ BUSCAR TODOS ------------------------------ */
export async function getEstoque() {
    try {
        return await prisma.estoque.findMany({
            include: {
                produto: true,
                loja: true
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR LOJA ------------------------------ */
export async function getEstoqueByLoja(loja_id) {
    try {
        return await prisma.estoque.findMany({
            where: {
                loja_id: loja_id
            },
            include: {
                produto: true,
                loja: true
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POT ID ----------------------------- */
export async function getEstoqueById(produto_id, loja_id) {
    try {
        return await prisma.estoque.findUnique({
            where: {
                produto_id_loja_id: {  // Prisma cria esse nome automaticamente para a chave composta
                    produto_id: Number(produto_id),
                    loja_id: Number(loja_id)
                }
            },
            include: {
                produto: true,
                loja: true
            },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ---------------------------------- CRIAR --------------------------------- */
export async function createEstoque(data) {
    const { quantidade } = data;

    if (quantidade < 0) {
        throw new Error('quantidade inválida.');
    }

    try {
        return await prisma.estoque.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateEstoque(produto_id, loja_id, data) {
    const { quantidade } = data;

    if (quantidade !== undefined && quantidade < 0) {
        throw new Error('Quantidade inválida.');
    }

    try {
        return await prisma.estoque.update({
            where: {
                produto_id_loja_id: {
                    produto_id: Number(produto_id),
                    loja_id: Number(loja_id),
                },
            },
            data: {
                quantidade: data.quantidade !== undefined ? data.quantidade : undefined,
                preco: data.preco !== undefined ? data.preco : undefined,
                valido_ate: data.valido_ate !== undefined ? data.valido_ate : undefined,
            },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}


/* ------------------------------- DELETAR ------------------------------- */
export async function deleteEstoque(produto_id, loja_id) {
    try {
        return await prisma.estoque.delete({
            where: {
                produto_id_loja_id: {
                    produto_id: Number(produto_id),
                    loja_id: Number(loja_id),
                },
            },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}