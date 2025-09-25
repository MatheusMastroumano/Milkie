import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tabelas = {
    lojas: prisma.lojas,
    funcionarios: prisma.funcionarios,
    usuarios: prisma.usuarios,
    produtos: prisma.produtos,
    precos: prisma.precos,
    estoque: prisma.estoque,
    fornecedores: prisma.fornecedores,
    fornecedor_produtos: prisma.fornecedor_produtos,
    vendas: prisma.vendas,
    venda_itens: prisma.venda_itens,
    venda_pagamentos: prisma.venda_pagamentos,
    caixa: prisma.caixa,
}

/* ------------------------ pegar todos os registros ------------------------ */
export async function getAll(table) {
    const model = tabelas[table];

    if (!model) throw new Error(`tabela ${table} inexixstente`);

    try {
        return await model.findMany();
    } catch (err) {
        console.error(`Erro ao buscar registros de ${table}: `, err);
        throw err;
    }
}

/* ------------------------------ pegar por id ------------------------------ */
export async function getById(table, id) {
    const model = tabelas[table];

    if (!model) throw new Error(`tabela ${table} inexixstente`);

    try {
        const item = await model.findUnique({ where: { id: Number(id) } });

        if (!item) throw new Error(`item não encontrado`);

        return item;
    } catch (err) {
        console.error(`Erro ao buscar item de ${table} por id: `, err);
        throw err;
    }
}

/* ---------------------------------- criar --------------------------------- */
export async function create(table, data) {
    const model = tabelas[table];

    if (!model) throw new Error(`tabela ${table} inexixstente`);

    try {
        return await model.create({ data });
    } catch (err) {
        console.error(`Erro ao criar registro em ${table}: `, err);
        throw err;
    }
}

/* -------------------------------- atualizar ------------------------------- */
export async function update(table, id, data) {
    const model = tabelas[table];

    if (!model) throw new Error(`tabela ${table} inexixstente`);

    try {
        return await model.update({ where: { id: Number(id) }, data });
    } catch (err) {
        console.error(`Erro ao atualizar item em ${table}: `, err);
        throw err;
    }
}

/* --------------------------------- excluir -------------------------------- */
export async function remove(table, id) {
    const model = tabelas[table];

    if (!model) throw new Error(`tabela ${table} inexixstente`);

    try {
        return await model.delete({ where: {id: Number(id)} });
    } catch (err) {
        console.error(`Erro ao deletar item em ${table}: `, err);
        throw err;
    }
}