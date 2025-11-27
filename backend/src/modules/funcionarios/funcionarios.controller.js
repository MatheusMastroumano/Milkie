import * as funcionariosService from './funcionarios.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getFuncionariosController(req, res) {
    try {
        const funcionarios = await funcionariosService.getFuncionarios();
        res.status(200).json({ funcionarios });
    } catch (err) {
        console.error('Erro ao listar funcionários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar funcionários: ', err });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getFuncionariosByIdController(req, res) {
    try {
        const funcionario = await funcionariosService.getFuncionariosById(req.params.id);

        if (!funcionario) {
            res.status(404).json({ mensagem: 'Funcionario não encontrado' });
        }

        res.status(200).json({ funcionario });
    } catch (err) {
        console.error('Erro ao listar funcionários por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar funcionários por id: ', erro: err.message });
    }
}

/* ------------------------------ VERIFICAR CPF ----------------------------- */
export async function verificarCpfController(req, res) {
    try {
        const { cpf } = req.params;
        const funcionarioId = req.query.funcionarioId; // Para verificação em edição
        
        const funcionario = await funcionariosService.getFuncionarioByCpf(cpf);
        
        if (funcionario) {
            // Se está editando e o CPF pertence ao próprio funcionário, não é duplicado
            if (funcionarioId && funcionario.id === parseInt(funcionarioId)) {
                return res.status(200).json({ existe: false, mensagem: 'CPF válido' });
            }
            return res.status(200).json({ existe: true, mensagem: 'Este CPF já está cadastrado' });
        }
        
        res.status(200).json({ existe: false, mensagem: 'CPF disponível' });
    } catch (err) {
        console.error('Erro ao verificar CPF: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao verificar CPF', erro: err.message });
    }
}

/* ---------------------------------- CRIAR --------------------------------- */
export async function createFuncionariosController(req, res) {
    try {
        const { loja_id, nome, cpf, email, telefone, idade, cargo, salario, ativo, imagem } = req.body;

        if (!loja_id) return res.status(400).json({ mensagem: 'Loja não informada' });

        const funcionarioData = { loja_id, nome, cpf, email, telefone, idade, cargo, salario, ativo, imagem };

        const funcionario = await funcionariosService.createFuncionarios(funcionarioData);

        res.status(201).json({ mensagem: 'Funcionario criado com sucesso', funcionario });
    } catch (err) {
        console.error('Erro ao criar funcionários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar funcionários: ', erro: err.message });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateFuncionariosController(req, res) {
    try {
        const funcionarioId = parseInt(req.params.id);
        const funcionario = await funcionariosService.getFuncionariosById(funcionarioId);

        if (!funcionario) {
            res.status(404).json({ mensagem: 'Funcionario nao encontrado' });
            return;
        }

        const { loja_id, nome, cpf, email, telefone, idade, cargo, salario, ativo, imagem } = req.body;

        if (!loja_id) return res.status(400).json({ mensagem: 'Loja não informada' });

        const funcionarioData = { loja_id, nome, cpf, email, telefone, idade, cargo, salario, ativo, imagem };

        const updatedFuncionario = await funcionariosService.updateFuncionarios(funcionarioId, funcionarioData);

        res.status(200).json({ mensagem: 'Funcionario atualizado com sucesso', updatedFuncionario });
    } catch (err) {
        console.error('Erro ao atualizar funcionários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar funcionários: ', erro: err.message });
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeFuncionariosController(req, res) {
    try {
        const funcionarioId = req.params.id;
        const funcionario = await funcionariosService.getFuncionariosById(funcionarioId);

        if (!funcionario) {
            res.status(404).json({ mensagem: 'Funcionario não encontrado' });
        }

        await funcionariosService.removeFuncionarios(funcionarioId);
        res.status(200).json({ mensagem: 'Funcionario removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover funcionários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover funcionários: ', erro: err.message });
    }
}
