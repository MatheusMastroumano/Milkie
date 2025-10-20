import prisma from '../../shared/config/database.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getVendaPagamentos() {
    try {
        return await prisma.venda_pagamentos.findMany({
            include: {
                venda: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getVendaPagamentosById(id) {
    try {
        return await prisma.venda_pagamentos.findUnique({
            where: { id: id },
            include: {
                venda: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ CRIAR ----------------------------- */
export async function createVendaPagamentos(data) {
    const { metodo } = data;

    if (metodo !== 'dinheiro' && metodo !== 'cartaodebito' && metodo !== 'cartaocredito' && metodo !== 'pix') {
        throw new Error('Metodo de pagamento inválido.');
    }

    try {
        return await prisma.venda_pagamentos.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ ATUALIZAR ----------------------------- */
export async function updateVendaPagamentos(id, data) {
    const { metodo } = data;

    if (metodo !== 'dinheiro' && metodo !== 'cartaodebito' && metodo !== 'cartaocredito' && metodo !== 'pix') {
        throw new Error('Metodo de pagamento inválido.');
    }

    try {
        return await prisma.venda_pagamentos.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ DELETAR ----------------------------- */
export async function removeVendaPagamentos(id) {
    try {
        return await prisma.venda_pagamentos.delete({
            where: { id: id },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}