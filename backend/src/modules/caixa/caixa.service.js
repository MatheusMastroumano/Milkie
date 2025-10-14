import prisma from '../../shared/config/database.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getCaixas() {
    try {
        return await prisma.caixas.findMany({
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
        return await prisma.caixas.findUnique({
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
        return await prisma.caixas.create({
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
        return await prisma.caixas.update({
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
        return await prisma.caixas.delete({
            where: { id: Number(id) },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}