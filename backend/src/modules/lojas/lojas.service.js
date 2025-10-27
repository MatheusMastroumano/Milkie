import prisma from '../../shared/config/database.js';
import { isCEP } from 'brazilian-values';
import cep from 'cep-promise';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getLojas() {
    try {
        return await prisma.lojas.findMany();
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getLojasById(id) {
    try {
        return await prisma.lojas.findUnique({
            where: { id: Number(id) },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createLojas(data) {
    const { nome, tipo, CEP, numero, ativo } = data;

    // VALIDAÇÕES
    if (!nome || nome.trim() === '') {
        throw new Error('Nome é obrigatório.');
    }

    const CEPValido = await cep(CEP);

    if (!CEP || !isCEP(CEP) || !CEPValido) {
        throw new Error('CEP inválido.');
    }

    if (tipo !== 'matriz' && tipo !== 'filial') {
        throw new Error('Tipo de loja inválido.');
    }

    if (ativo !== true && ativo !== false) {
        throw new Error('Ativo inválido.');
    }

    // validar se CEP existe
    const cepExiste = await prisma.lojas.findUnique({
        where: { CEP: CEP },
    });

    if (cepExiste) {
        throw new Error('Já existe uma loja cadastrada com esse CEP.');
    }

    try {
        return await prisma.lojas.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateLojas(id, data) {
    const { nome, tipo, CEP, ativo } = data;

    // VALIDAÇÕES
    if (!nome || nome.trim() === '') {
        throw new Error('Nome é obrigatório.');
    }

    const CEPValido = await cep(CEP);

    if (!CEP || !isCEP(CEP) || !CEPValido) {
        throw new Error('CEP inválido.');
    }


    // isso faz com que o CEP não precise mudar na rota PUT
    const lojaAtual = await prisma.lojas.findUnique({
        where: { id: Number(id) },
    });

    if (CEP && CEP !== lojaAtual.CEP) {
        data.CEP = CEP;
    }
    // -----------------------------------------------------



    if (tipo !== 'matriz' && tipo !== 'filial') {
        throw new Error('Tipo de loja inválido.');
    }

    if (ativo !== true && ativo !== false) {
        throw new Error('Ativo inválido.');
    }

    try {
        return await prisma.lojas.update({
            where: { id: Number(id) },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeLojas(id) {
    try {
        return await prisma.lojas.delete({
            where: { id: Number(id) },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}