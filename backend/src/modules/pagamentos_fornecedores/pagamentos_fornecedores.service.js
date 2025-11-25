import prisma from '../../shared/config/database.js'

// buscar todos os pagamentos de fornecedores
export async function getPagamentosFornecedores() {
    try {
        return await prisma.pagamentos_fornecedores.findMany({
            include: {
                fornecedor: {
                    select: {
                        id: true,
                        nome: true,
                    }
                },
                loja: {
                    select: {
                        id: true,
                        nome: true,
                    }
                }
            },
            orderBy: {
                vencimento: 'desc'
            }
        });
    } catch (err) {
        console.error("Erro ao buscar pagamentos de fornecedores: ", err);
        throw new Error(err.message);
    }
}

// buscar pagamentos por loja
export async function getPagamentosFornecedoresByLoja(lojaId) {
    try {
        return await prisma.pagamentos_fornecedores.findMany({
            where: {
                loja_id: Number(lojaId)
            },
            include: {
                fornecedor: {
                    select: {
                        id: true,
                        nome: true,
                    }
                },
                loja: {
                    select: {
                        id: true,
                        nome: true,
                    }
                }
            },
            orderBy: {
                vencimento: 'desc'
            }
        });
    } catch (err) {
        console.error("Erro ao buscar pagamentos de fornecedores por loja: ", err);
        throw new Error(err.message);
    }
}

// buscar pagamento por id
export async function getPagamentoFornecedorById(id) {
    try {
        return await prisma.pagamentos_fornecedores.findUnique({
            where: { id: Number(id) },
            include: {
                fornecedor: {
                    select: {
                        id: true,
                        nome: true,
                    }
                },
                loja: {
                    select: {
                        id: true,
                        nome: true,
                    }
                }
            }
        });
    } catch (err) {
        console.error("Erro ao buscar pagamento de fornecedor por id: ", err);
        throw new Error(err.message);
    }
}

// criar pagamento de fornecedor
export async function createPagamentoFornecedor(data) {
    try {
        const { fornecedor_id, loja_id, valor, vencimento, data_pagamento, status } = data;

        return await prisma.pagamentos_fornecedores.create({
            data: {
                fornecedor_id: Number(fornecedor_id),
                loja_id: Number(loja_id),
                valor: Number(valor),
                vencimento: new Date(vencimento),
                data_pagamento: data_pagamento ? new Date(data_pagamento) : null,
                status: status || 'pendente',
                criado_em: new Date(),
            },
        });
    } catch (err) {
        console.error('Erro ao criar pagamento de fornecedor:', err);
        throw new Error(err.message);
    }
}

// atualizar pagamento de fornecedor
export async function updatePagamentoFornecedorById(id, data) {
    try {
        return await prisma.pagamentos_fornecedores.update({
            where: { id: Number(id) },
            data: {
                ...data,
                valor: data.valor ? Number(data.valor) : undefined,
                vencimento: data.vencimento ? new Date(data.vencimento) : undefined,
                data_pagamento: data.data_pagamento ? new Date(data.data_pagamento) : (data.data_pagamento === null ? null : undefined),
            },
        });
    } catch (err) {
        console.error("Erro ao atualizar pagamento de fornecedor: ", err);
        throw new Error(err.message);
    }
}

// remover pagamento de fornecedor
export async function removePagamentoFornecedor(id) {
    try {
        return await prisma.pagamentos_fornecedores.delete({
            where: { id: Number(id) }
        });
    } catch (err) {
        console.error("Erro ao remover pagamento de fornecedor: ", err);
        throw new Error(err.message);
    }
}

