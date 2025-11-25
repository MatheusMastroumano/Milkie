import * as pagamentosFornecedoresService from './pagamentos_fornecedores.service.js'

// buscar todos os pagamentos de fornecedores
export async function getPagamentosFornecedoresController(req, res) {
    try {
        const pagamentos = await pagamentosFornecedoresService.getPagamentosFornecedores();
        res.status(200).json({ pagamentos_fornecedores: pagamentos });
    } catch (err) {
        console.error('Erro ao listar pagamentos de fornecedores: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar pagamentos de fornecedores', erro: err.message });
    }
}

// buscar pagamento por id
export async function getPagamentoFornecedorByIdController(req, res) {
    try {
        const pagamento = await pagamentosFornecedoresService.getPagamentoFornecedorById(req.params.id);

        if (!pagamento) {
            return res.status(404).json({ mensagem: "Pagamento de fornecedor não encontrado" });
        }

        res.status(200).json({ pagamento_fornecedor: pagamento });
    } catch (err) {
        console.error('Erro ao buscar pagamento de fornecedor por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar pagamento de fornecedor por id', erro: err.message });
    }
}

// criar pagamento de fornecedor
export async function createPagamentoFornecedorController(req, res) {
    try {
        const { fornecedor_id, loja_id, valor, vencimento, data_pagamento, status } = req.body;

        const pagamentoData = { fornecedor_id, loja_id, valor, vencimento, data_pagamento, status };

        const pagamento = await pagamentosFornecedoresService.createPagamentoFornecedor(pagamentoData);

        res.status(201).json({ mensagem: 'Pagamento de fornecedor criado com sucesso', pagamento_fornecedor: pagamento });
    } catch (err) {
        console.error('Erro ao criar pagamento de fornecedor: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar pagamento de fornecedor', erro: err.message });
    }
}

// atualizar pagamento de fornecedor
export async function updatePagamentoFornecedorController(req, res) {
    try {
        const pagamentoId = parseInt(req.params.id);
        const pagamento = await pagamentosFornecedoresService.getPagamentoFornecedorById(pagamentoId);

        if (!pagamento) {
            return res.status(404).json({ mensagem: 'Pagamento de fornecedor não encontrado' });
        }

        const { fornecedor_id, loja_id, valor, vencimento, data_pagamento, status } = req.body;

        const pagamentoData = { fornecedor_id, loja_id, valor, vencimento, data_pagamento, status };

        const updatedPagamento = await pagamentosFornecedoresService.updatePagamentoFornecedorById(pagamentoId, pagamentoData);

        res.status(200).json({ mensagem: 'Pagamento de fornecedor atualizado com sucesso', pagamento_fornecedor: updatedPagamento });
    } catch (err) {
        console.error('Erro ao atualizar pagamento de fornecedor: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar pagamento de fornecedor', erro: err.message });
    }
}

// remover pagamento de fornecedor
export async function removePagamentoFornecedorController(req, res) {
    try {
        const pagamentoId = parseInt(req.params.id);
        const pagamento = await pagamentosFornecedoresService.getPagamentoFornecedorById(pagamentoId);

        if (!pagamento) {
            return res.status(404).json({ mensagem: 'Pagamento de fornecedor não encontrado' });
        }

        await pagamentosFornecedoresService.removePagamentoFornecedor(pagamentoId);
        res.status(200).json({ mensagem: 'Pagamento de fornecedor removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover pagamento de fornecedor: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover pagamento de fornecedor', erro: err.message });
    }
}

