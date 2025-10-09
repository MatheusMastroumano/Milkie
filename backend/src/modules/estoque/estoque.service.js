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

/* ------------------------------ BUSCAR POT ID ----------------------------- */
export async function getEstoqueById(id) {
    try {
        return await prisma.estoque.findUnique({
            where: { id: id },
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
export async function updateEstoque(id, data) {
    try {
        return await prisma.estoque.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- DELETAR ------------------------------- */
export async function deleteEstoque(id) {
    try {
        return await prisma.estoque.delete({
            where: { id: id },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}