import prisma from '../../shared/config/database.js';
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