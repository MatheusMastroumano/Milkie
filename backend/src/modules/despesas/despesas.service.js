import prisma from '../../shared/config/database.js'

// buscar todas as despesas
export async function getDespesas() {
    try {
        return await prisma.despesas.findMany({
            include: {
                loja: {
                    select: {
                        id: true,
                        nome: true,
                    }
                }
            },
            orderBy: {
                data: 'desc'
            }
        });
    } catch (err) {
        console.error("Erro ao buscar despesas: ", err);
        throw new Error(err.message);
    }
}

// buscar despesas por loja
export async function getDespesasByLoja(lojaId) {
    try {
        return await prisma.despesas.findMany({
            where: {
                loja_id: Number(lojaId)
            },
            include: {
                loja: {
                    select: {
                        id: true,
                        nome: true,
                    }
                }
            },
            orderBy: {
                data: 'desc'
            }
        });
    } catch (err) {
        console.error("Erro ao buscar despesas por loja: ", err);
        throw new Error(err.message);
    }
}

// buscar despesa por id
export async function getDespesaById(id) {
    try {
        return await prisma.despesas.findUnique({
            where: { id: Number(id) },
            include: {
                loja: {
                    select: {
                        id: true,
                        nome: true,
                    }
                }
            }
        });
    } catch (err) {
        console.error("Erro ao buscar despesa por id: ", err);
        throw new Error(err.message);
    }
}

// criar despesa
export async function createDespesa(data) {
    try {
        const { loja_id, descricao, valor, data: dataDespesa, categoria, status } = data;

        return await prisma.despesas.create({
            data: {
                loja_id: Number(loja_id),
                descricao,
                valor: Number(valor),
                data: new Date(dataDespesa),
                categoria,
                status: status || 'pendente',
                criado_em: new Date(),
            },
        });
    } catch (err) {
        console.error('Erro ao criar despesa:', err);
        throw new Error(err.message);
    }
}

// atualizar despesa
export async function updateDespesaById(id, data) {
    try {
        return await prisma.despesas.update({
            where: { id: Number(id) },
            data: {
                ...data,
                valor: data.valor ? Number(data.valor) : undefined,
                data: data.data ? new Date(data.data) : undefined,
            },
        });
    } catch (err) {
        console.error("Erro ao atualizar despesa: ", err);
        throw new Error(err.message);
    }
}

// remover despesa
export async function removeDespesa(id) {
    try {
        return await prisma.despesas.delete({
            where: { id: Number(id) }
        });
    } catch (err) {
        console.error("Erro ao remover despesa: ", err);
        throw new Error(err.message);
    }
}

