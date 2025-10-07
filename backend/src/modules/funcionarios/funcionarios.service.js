import prisma from '../../shared/config/database.js';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getFuncionarios() {
    try {
        return await prisma.funcionarios.findMany();
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getFuncionariosById(id) {
    try {
        return await prisma.funcionarios.findUnique({
            where: { id: id },
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ---------------------------------- CRIAR --------------------------------- */
export async function createFuncionarios(data) {
    const { nome, cpf, email, telefone, idade, cargo, salario, ativo } = data;

    // VALIDAÇÕES
    if (!nome || nome.trim() === '') {
        throw new Error('Nome é obrigatório.');
    }

    // aqui se usa o import do cpf validator
    if (cpf && !cpfValidator.isValid(CPF)) {
        throw new Error('CPF inválido. Deve conter 11 dígitos numéricos.');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('E-mail inválido.');
    }

    if (telefone && !/^\d{10,11}$/.test(telefone)) {
        throw new Error('Telefone deve conter DDD + número (10 ou 11 dígitos).');
    }

    if (idade && idade < 16) {
        throw new Error('Idade mínima é 16 anos.');
    }

    if (salario && salario < 0) {
        throw new Error('Salário não pode ser negativo.');
    }

    const cargosPermitidos = ['gerente', 'vendedor', 'caixa'];
    if (cargo && !cargosPermitidos.includes(cargo.toLowerCase())) {
        throw new Error(`Cargo inválido. Valores aceitos: ${cargosPermitidos.join(', ')}.`);
    }

    try {
        return await prisma.funcionarios.create({
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateFuncionarios(id, data) {
    const { nome, email, telefone, idade, cargo, salario, ativo } = data;

    // VALIDAÇÕES
    if (nome !== undefined && nome.trim() === '') {
        throw new Error('Nome não pode ser vazio.');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('E-mail inválido.');
    }

    if (telefone && !/^\d{10,11}$/.test(telefone)) {
        throw new Error('Telefone deve conter DDD + número (10 ou 11 dígitos).');
    }

    if (idade && idade < 16) {
        throw new Error('Idade mínima é 16 anos.');
    }

    if (salario && salario < 0) {
        throw new Error('Salário não pode ser negativo.');
    }

    const cargosPermitidos = ['gerente', 'vendedor', 'caixa'];
    if (cargo && !cargosPermitidos.includes(cargo.toLowerCase())) {
        throw new Error(`Cargo inválido. Valores aceitos: ${cargosPermitidos.join(', ')}.`);
    }

    try {
        return await prisma.funcionarios.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}


/* ------------------------------- REMOVER ------------------------------- */
export async function removeFuncionarios(id) {
    try {
        return await prisma.funcionarios.delete({
            where: { id: id }
        });
    } catch (err) {
        console.error('error: ', err);
        throw new Error(err.message);
    }
}