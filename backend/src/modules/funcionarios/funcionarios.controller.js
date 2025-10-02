import * as funcionariosService from './funcionarios.service.js';

export async function getFuncionariosController(req, res) {
    try {
        const funcionarios = await funcionariosService.getFuncionarios();
        res.status(500).json({ funcionarios });
    } catch (err) {
        console.error('Erro ao listar funcionários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar funcionários: ', err });
    }
}

export async function getFuncionariosByIdController(req, res) {
    try {
        const funcionario = await funcionariosService.getFuncionariosById(req.params.id);

        if (!funcionario) {
            res.status(404).json({ mensagem: 'Funcionario não encontrado' });
        }

        res.status(200).json({ funcionario });
    } catch (err) {
        console.error('Erro ao listar funcionários por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar funcionários por id: ', err });
    }
}

export async function createFuncionariosController() {
    try {
        const { id, nome, cpf, email, telefone, idade, cargo, salario, ativo, criado_em } = req.body;

        const funcionarioData = { id, nome, cpf, email, telefone, idade, cargo, salario, ativo, criado_em };

        const funcionario = await funcionariosService.createFuncionarios(funcionarioData);

        res.status(201).json({ mensagem: 'Funcionario criado com sucesso', funcionario });
    } catch (err) {
        console.error('Erro ao criar funcionários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar funcionários: ', err });
    }
}

export async function updateFuncionariosController(req, res) {
    try {
        const funcionarioId = req.params.id;
        const funcionario = await funcionariosService.getFuncionariosById(funcionarioId);

        if (!funcionario) {
            res.status(404).json({ mensagem: 'Funcionario nao encontrado' });
        }

        const { id, nome, cpf, email, telefone, idade, cargo, salario, ativo, criado_em } = req.body;

        const funcionarioData = { id, nome, cpf, email, telefone, idade, cargo, salario, ativo, criado_em };

        const updatedFuncionario = await funcionariosService.updateFuncionarios(funcionarioId, funcionarioData);

        res.status(200).json({ mensagem: 'Funcionario atualizado com sucesso', updatedFuncionario });
    } catch (err) {
        console.error('Erro ao criar funcionários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar funcionários: ', err });
    }
}

export async function removeFuncionariosController(req, res) {
    try {
        const funcionarioId = req.params.id;
        const funcionario = await funcionariosService.getFuncionariosById(funcionarioId);

        if (!funcionario) {
            res.status(404).json({ mensagem: 'Funcionario não encontrado' });
        }

        await funcionariosService.removeFuncionarios(id);
        res.status(200).json({ mensagem: 'Funcionario removido com sucesso' });
    } catch (err) {
        console.error('Erro ao criar funcionários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar funcionários: ', err });
    }
}
