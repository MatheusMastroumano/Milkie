import prisma from '../../shared/config/database.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getPrecos() {
    try {
        return await prisma.precos.findMany({
            include: {
                loja: true,
                produto: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getPrecosById(id) {
    try {
        return await prisma.precos.findUnique({
            where: { id: Number(id) },
            include: {
                loja: true,
                produto: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ CRIAR ----------------------------- */
export async function createPrecos(data) {
    const { preco, valido_de, valido_ate } = data;

    if (preco < 0) {
        throw new Error('Preço inválido.');
    }

    if (valido_de > valido_ate) {
        throw new Error('A data de início não pode ser posterior à data final.');
    }

    // opcional: não deixar validade já expirada
    if (valido_ate < new Date()) {
        throw new Error('Período de validade expirado.');
    }


    try {
        return await prisma.precos.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ ATUALIZAR ----------------------------- */
export async function updatePrecos(id, data) {
    const { preco, valido_de, valido_ate } = data;

    if (valido_de > valido_ate) {
        throw new Error('Datas inválidas.');
    }

    if (preco < 0) {
        throw new Error('Preço inválido.');
    }

    if (valido_de < new Date()) {
        throw new Error('Datas inválidas.');
    }

    if (valido_ate < new Date()) {
        throw new Error('Datas inválidas.');
    }

    if (valido_ate < valido_de) {
        throw new Error('Datas inválidas.');
    }

    try {
        return await prisma.precos.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ REMOVER ----------------------------- */
export async function removePrecos(id) {
    try {
        return await prisma.precos.delete({
            where: { id: Number(id) },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}