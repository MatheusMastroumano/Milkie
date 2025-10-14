import prisma from '../../shared/config/database.js';

/* ------------------------------ BUSCAR TODOS ------------------------------ */
export async function getVendaItens() {
    try {
        return await prisma.venda_itens.findMany({
            include: {
                venda: true,
                produto: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getVendaItensById(id) {
    try {
        return await prisma.venda_itens.findUnique({
            where: { id: id },
            include: {
                venda: true,
                produto: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ---------------------------------- CRIAR --------------------------------- */
export async function createVendaItens(data) {
    try {
        return await prisma.venda_itens.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateVendaItens(id, data) {
    try {
        return await prisma.venda_itens.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- DELETAR ------------------------------- */
export async function deleteVendaItens(id) {
    try {
        return await prisma.venda_itens.delete({
            where: { id: id },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}