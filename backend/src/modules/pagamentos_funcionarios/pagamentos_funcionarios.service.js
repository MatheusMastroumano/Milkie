import prisma from '../../shared/config/database.js'

// buscar todos os pagamentos de funcionários
export async function getPagamentosFuncionarios() {
    try {
        return await prisma.pagamentos_funcionarios.findMany({
            include: {
                funcionario: {
                    select: {
                        id: true,
                        nome: true,
                        cargo: true,
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
                criado_em: 'desc'
            }
        });
    } catch (err) {
        console.error("Erro ao buscar pagamentos de funcionários: ", err);
        throw new Error(err.message);
    }
}

// buscar pagamentos por loja
export async function getPagamentosFuncionariosByLoja(lojaId) {
    try {
        return await prisma.pagamentos_funcionarios.findMany({
            where: {
                loja_id: Number(lojaId)
            },
            include: {
                funcionario: {
                    select: {
                        id: true,
                        nome: true,
                        cargo: true,
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
                criado_em: 'desc'
            }
        });
    } catch (err) {
        console.error("Erro ao buscar pagamentos de funcionários por loja: ", err);
        throw new Error(err.message);
    }
}

// buscar pagamento por id
export async function getPagamentoFuncionarioById(id) {
    try {
        return await prisma.pagamentos_funcionarios.findUnique({
            where: { id: Number(id) },
            include: {
                funcionario: {
                    select: {
                        id: true,
                        nome: true,
                        cargo: true,
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
        console.error("Erro ao buscar pagamento de funcionário por id: ", err);
        throw new Error(err.message);
    }
}

// criar pagamento de funcionário
export async function createPagamentoFuncionario(data) {
    try {
        const { funcionario_id, loja_id, salario, comissao, data_pagamento, status } = data;

        return await prisma.pagamentos_funcionarios.create({
            data: {
                funcionario_id: Number(funcionario_id),
                loja_id: Number(loja_id),
                salario: Number(salario),
                comissao: Number(comissao || 0),
                data_pagamento: data_pagamento ? new Date(data_pagamento) : null,
                status: status || 'pendente',
                criado_em: new Date(),
            },
        });
    } catch (err) {
        console.error('Erro ao criar pagamento de funcionário:', err);
        throw new Error(err.message);
    }
}

// atualizar pagamento de funcionário
export async function updatePagamentoFuncionarioById(id, data) {
    try {
        return await prisma.pagamentos_funcionarios.update({
            where: { id: Number(id) },
            data: {
                ...data,
                salario: data.salario ? Number(data.salario) : undefined,
                comissao: data.comissao !== undefined ? Number(data.comissao) : undefined,
                data_pagamento: data.data_pagamento ? new Date(data.data_pagamento) : (data.data_pagamento === null ? null : undefined),
            },
        });
    } catch (err) {
        console.error("Erro ao atualizar pagamento de funcionário: ", err);
        throw new Error(err.message);
    }
}

// remover pagamento de funcionário
export async function removePagamentoFuncionario(id) {
    try {
        return await prisma.pagamentos_funcionarios.delete({
            where: { id: Number(id) }
        });
    } catch (err) {
        console.error("Erro ao remover pagamento de funcionário: ", err);
        throw new Error(err.message);
    }
}

