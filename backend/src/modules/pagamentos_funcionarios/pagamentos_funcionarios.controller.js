import * as pagamentosFuncionariosService from './pagamentos_funcionarios.service.js'

// buscar todos os pagamentos de funcionários
export async function getPagamentosFuncionariosController(req, res) {
    try {
        const pagamentos = await pagamentosFuncionariosService.getPagamentosFuncionarios();
        res.status(200).json({ pagamentos_funcionarios: pagamentos });
    } catch (err) {
        console.error('Erro ao listar pagamentos de funcionários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar pagamentos de funcionários', erro: err.message });
    }
}

// buscar pagamento por id
export async function getPagamentoFuncionarioByIdController(req, res) {
    try {
        const pagamento = await pagamentosFuncionariosService.getPagamentoFuncionarioById(req.params.id);

        if (!pagamento) {
            return res.status(404).json({ mensagem: "Pagamento de funcionário não encontrado" });
        }

        res.status(200).json({ pagamento_funcionario: pagamento });
    } catch (err) {
        console.error('Erro ao buscar pagamento de funcionário por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar pagamento de funcionário por id', erro: err.message });
    }
}

// criar pagamento de funcionário
export async function createPagamentoFuncionarioController(req, res) {
    try {
        const { funcionario_id, loja_id, salario, comissao, data_pagamento, status } = req.body;

        const pagamentoData = { funcionario_id, loja_id, salario, comissao, data_pagamento, status };

        const pagamento = await pagamentosFuncionariosService.createPagamentoFuncionario(pagamentoData);

        res.status(201).json({ mensagem: 'Pagamento de funcionário criado com sucesso', pagamento_funcionario: pagamento });
    } catch (err) {
        console.error('Erro ao criar pagamento de funcionário: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar pagamento de funcionário', erro: err.message });
    }
}

// atualizar pagamento de funcionário
export async function updatePagamentoFuncionarioController(req, res) {
    try {
        const pagamentoId = parseInt(req.params.id);
        const pagamento = await pagamentosFuncionariosService.getPagamentoFuncionarioById(pagamentoId);

        if (!pagamento) {
            return res.status(404).json({ mensagem: 'Pagamento de funcionário não encontrado' });
        }

        const { funcionario_id, loja_id, salario, comissao, data_pagamento, status } = req.body;

        const pagamentoData = { funcionario_id, loja_id, salario, comissao, data_pagamento, status };

        const updatedPagamento = await pagamentosFuncionariosService.updatePagamentoFuncionarioById(pagamentoId, pagamentoData);

        res.status(200).json({ mensagem: 'Pagamento de funcionário atualizado com sucesso', pagamento_funcionario: updatedPagamento });
    } catch (err) {
        console.error('Erro ao atualizar pagamento de funcionário: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar pagamento de funcionário', erro: err.message });
    }
}

// remover pagamento de funcionário
export async function removePagamentoFuncionarioController(req, res) {
    try {
        const pagamentoId = parseInt(req.params.id);
        const pagamento = await pagamentosFuncionariosService.getPagamentoFuncionarioById(pagamentoId);

        if (!pagamento) {
            return res.status(404).json({ mensagem: 'Pagamento de funcionário não encontrado' });
        }

        await pagamentosFuncionariosService.removePagamentoFuncionario(pagamentoId);
        res.status(200).json({ mensagem: 'Pagamento de funcionário removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover pagamento de funcionário: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover pagamento de funcionário', erro: err.message });
    }
}

