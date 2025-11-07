import prisma from '../../shared/config/database.js';
import { Prisma } from '@prisma/client';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getVendas() {
    try {
        return await prisma.vendas.findMany({
            include: {
                loja: true,
                usuario: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getVendasById(id) {
    try {
        return await prisma.vendas.findUnique({
            where: { id: id },
            include: {
                loja: true,
                usuario: true,
            }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createVendas(data) {
    const { comprador_cpf } = data;

    // aqui se usa o import do cpf validator
    if (comprador_cpf && !cpfValidator.isValid(comprador_cpf)) {
        throw new Error('CPF inválido. Deve conter 11 dígitos numéricos.');
    }

    try {
        return await prisma.vendas.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateVendas(id, data) {
    const { comprador_cpf } = data;

    // aqui se usa o import do cpf validator
    if (comprador_cpf && !cpfValidator.isValid(comprador_cpf)) {
        throw new Error('CPF inválido. Deve conter 11 dígitos numéricos.');
    }

    try {
        return await prisma.vendas.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeVendas(id) {
    try {
        return await prisma.vendas.delete({
            where: { id: id },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* --------------------------- FINALIZAR (TRANSACIONAL) --------------------------- */
export async function finalizarVenda({ loja_id, usuario_id, itens, comprador_cpf = null, metodo_pagamento = 'dinheiro' }) {
    const metodoNormalizado = String(metodo_pagamento || 'dinheiro').toLowerCase();
    const metodosPermitidos = ['dinheiro', 'cartaocredito', 'cartaodebito', 'pix'];
    if (!metodosPermitidos.includes(metodoNormalizado)) {
        throw new Error('Método de pagamento inválido');
    }
    // itens esperado: [{ produto_id, quantidade }]
    if (!Array.isArray(itens) || itens.length === 0) {
        throw new Error('Itens da venda são obrigatórios');
    }

    if (comprador_cpf && !cpfValidator.isValid(comprador_cpf)) {
        throw new Error('CPF inválido. Deve conter 11 dígitos numéricos.');
    }

    return await prisma.$transaction(async (tx) => {
        // Garantir que a loja existe
        const loja = await tx.lojas.findUnique({ where: { id: Number(loja_id) } });
        if (!loja) {
            throw new Error('Loja não encontrada');
        }

        // Resolver usuário (usar existente, senão criar um usuário de teste)
        let usuarioIdResolvido = Number(usuario_id);
        if (!usuarioIdResolvido || Number.isNaN(usuarioIdResolvido)) {
            usuarioIdResolvido = 0;
        }
        let usuario = usuarioIdResolvido
            ? await tx.usuarios.findUnique({ where: { id: usuarioIdResolvido } })
            : null;
        if (!usuario) {
            // Tentar pegar qualquer usuário existente da loja
            usuario = await tx.usuarios.findFirst({ where: { loja_id: Number(loja_id) } });
        }
        if (!usuario) {
            // Criar funcionário e usuário mínimos para teste
            const funcionario = await tx.funcionarios.create({
                data: {
                    loja_id: Number(loja_id),
                    nome: 'PDV Teste',
                    cpf: `000${Date.now()}`.slice(-11),
                    email: `pdv${Date.now()}@teste.local`,
                    telefone: '0000000000',
                    idade: 18,
                    cargo: 'caixa',
                    salario: 0,
                },
            });
            usuario = await tx.usuarios.create({
                data: {
                    funcionario_id: funcionario.id,
                    loja_id: Number(loja_id),
                    username: `pdv_${funcionario.id}`,
                    senha_hash: 'x',
                },
            });
        }

        const usuarioIdFinal = usuario.id;
        // Buscar estoques dos produtos na loja
        const produtoIds = itens.map((i) => Number(i.produto_id));
        const estoques = await tx.estoque.findMany({
            where: { loja_id: Number(loja_id), produto_id: { in: produtoIds } },
            include: { produto: true },
        });

        // Mapear para acesso rápido
        const estoquePorProduto = new Map();
        for (const e of estoques) {
            estoquePorProduto.set(e.produto_id, e);
        }

        // Validar disponibilidade e calcular totais
        let valor_total = new Prisma.Decimal(0);
        const itensPreparados = itens.map((item) => {
            const pid = Number(item.produto_id);
            const qtd = Number(item.quantidade);
            const est = estoquePorProduto.get(pid);
            if (qtd <= 0) {
                throw new Error(`Quantidade inválida para o produto ${pid}`);
            }

            let preco_unitario = null;
            if (est) {
                if (est.quantidade < qtd) {
                    throw new Error(`Estoque insuficiente para o produto ${pid}. Disponível: ${est.quantidade}`);
                }
                preco_unitario = new Prisma.Decimal(est.preco);
            }

            if (!preco_unitario) {
                if (item.preco == null) {
                    throw new Error(`Preço não informado para o produto ${pid}`);
                }
                preco_unitario = new Prisma.Decimal(item.preco);
            }

            const quantidadeDecimal = new Prisma.Decimal(qtd);
            const subtotal = preco_unitario.mul(quantidadeDecimal);
            valor_total = valor_total.add(subtotal);
            return {
                produto_id: pid,
                quantidadeDecimal,
                quantidadeNumber: qtd,
                preco_unitario,
                subtotal,
            };
        });

        // Criar venda
        const venda = await tx.vendas.create({
            data: {
                loja_id: Number(loja_id),
                usuario_id: Number(usuarioIdFinal),
                comprador_cpf: comprador_cpf || null,
                valor_total,
            },
        });

        // Criar itens e baixar estoque
        for (const it of itensPreparados) {
            await tx.venda_itens.create({
                data: {
                    venda_id: venda.id,
                    produto_id: it.produto_id,
                    quantidade: it.quantidadeDecimal,
                    preco_unitario: it.preco_unitario,
                    subtotal: it.subtotal,
                },
            });

            if (estoquePorProduto.has(it.produto_id)) {
                await tx.estoque.update({
                    where: {
                        produto_id_loja_id: {
                            produto_id: it.produto_id,
                            loja_id: Number(loja_id),
                        },
                    },
                    data: { quantidade: { decrement: it.quantidadeNumber } },
                });
            }
        }

        await tx.venda_pagamentos.create({
            data: {
                venda_id: venda.id,
                metodo: metodoNormalizado,
                valor: valor_total,
            }
        });

        return {
            venda,
            itens: itensPreparados.map((it) => ({
                produto_id: it.produto_id,
                quantidade: it.quantidadeDecimal.toNumber(),
                preco_unitario: it.preco_unitario.toNumber(),
                subtotal: it.subtotal.toNumber(),
            })),
            valor_total: valor_total.toNumber(),
            metodo_pagamento: metodoNormalizado,
        };
    });
}