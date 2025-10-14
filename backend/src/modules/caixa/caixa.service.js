import prisma from '../../shared/config/database.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getCaixas() {
    try {
        return await prisma.caixa.findMany({
            include: {
                loja: true,
                abertoPor: true,
                fechadoPor: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getCaixasById(id) {
    try {
        return await prisma.caixa.findUnique({
            where: { id: id },
            include: {
                loja: true,
                abertoPor: true,
                fechadoPor: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createCaixas(data) {
    const { status } = data;

    if (status !== 'aberto' && status !== 'fechado') {
        throw new Error('Status inválido.');
    }

    try {
        return await prisma.caixa.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateCaixas(id, data) {
    const { status } = data;

    if (status !== 'aberto' && status !== 'fechado') {
        throw new Error('Status inválido.');
    }

    try {
        return await prisma.caixa.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeCaixas(id) {
    try {
        return await prisma.caixa.delete({
            where: { id: Number(id) },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}