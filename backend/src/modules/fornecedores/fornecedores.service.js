import prisma from '../../shared/config/database.js'
import cep from "cep-promise";
import { cpf, cnpj } from "cpf-cnpj-validator";

// mostra todos os fornecedores
export async function getFornecedores() {
    try {
        return await prisma.fornecedores.findMany();
    } catch (err) {
        console.error("Erro ao buscar funcionarios: ", err);
        throw new Error(err.message);
    }
}

// procurar fornecedor por id
export async function getFornecedoresById(id) {
    try {
        return await prisma.fornecedores.findUnique({
            where:
                { id: id },
        });
    } catch (err) {
        console.error("Erro ao buscar funcionarios por id: ", err);
        throw new Error(err.message);
    }
}

export async function createFornecedores(data) {
    try {
        // valida os dados recebidos
        const validData = FornecedorSchema.parse(data);

        const endereco = await cep(cepUsuario);

        // cria no banco
        return await prisma.fornecedores.create({
            data: {
                nome,
                cnpj_cpf,
                cep: endereco.cep,
                estado: endereco.state,
                cidade: endereco.city,
                bairro: endereco.neighborhood,
                rua: endereco.street,
                numero,
                complemento,
                ativo: ativo ?? true,
                criado_em: new Date(),
            },
        });
    } catch (err) {
        console.error("Erro ao criar fornecedor: ", err);
        throw new Error(err.message);
    }
}

//atualizar fornecedores
export async function updateFornecedores(id, data) {
    try {
        return await prisma.fornecedores.update({
            where: { id: id },
            data: data,
        });
    } catch (err) {
        console.error("Erro ao buscar funcionarios: ", err);
        throw new Error(err.message);
    }
}

// remover fornecedores
export async function removeFornecedores(id) {
    try {
        return await prisma.fornecedores.delete({
            where: { id: id }
        });
    } catch (err) {
        console.error("Erro ao deletar fornecedor: ", err);
        throw new Error(err.message);
    }
}