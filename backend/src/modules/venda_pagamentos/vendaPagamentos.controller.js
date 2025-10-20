import * as vendaPagamentosService from './vendaPagamentos.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getVendaPagamentosController(req, res) {
    try {
        const vendaPagamentos = await vendaPagamentosService.getVendaPagamentos();
        res.status(200).json({ vendaPagamentos });
    } catch (err) {
        console.error('Erro ao listar venda_pagamentos: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar venda_pagamentos', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getVendaPagamentosByIdController(req, res) {
    try {
        const vendaPagamentos = await vendaPagamentosService.getVendaPagamentosById(req.params.id);

        if (!vendaPagamentos) {
            return res.status(404).json({ mensagem: 'Venda_pagamentos nao encontrada' });
        }

        res.status(200).json({ vendaPagamentos });
    } catch (err) {
        console.error('Erro ao buscar venda_pagamentos por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar venda_pagamentos por id', erro: err.message });
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createVendaPagamentosController(req, res) {
    try {
        const { venda_id, metodo, valor} = req.body;

        const vendaPagamentosData = { venda_id, metodo, valor };

        const vendaPagamentos = await vendaPagamentosService.createVendaPagamentos(vendaPagamentosData);
        res.status(201).json({ vendaPagamentos });
    } catch (err) {
        console.error('Erro ao criar venda_pagamentos: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar venda_pagamentos', erro: err.message });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateVendaPagamentosController(req, res) {
    try {
        const vendaPagamentosId = parseInt(req.params.id);
        const vendaPagamentos = await vendaPagamentosService.getVendaPagamentosById(vendaPagamentosId);

        if (!vendaPagamentos) {
            return res.status(404).json({ mensagem: 'Venda_pagamentos nao encontrada' });
        }

        const { venda_id, metodo, valor } = req.body;

        const vendaPagamentosData = { venda_id, metodo, valor };

        const vendaPagamentosAtualizado = await vendaPagamentosService.updateVendaPagamentos(vendaPagamentosId, vendaPagamentosData);

        res.status(200).json({ mensagem: 'Venda_pagamentos atualizado com sucesso', vendaPagamentosAtualizado });
    } catch (err) {
        console.error('Erro ao atualizar venda_pagamentos: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar venda_pagamentos', erro: err.message });
    }
}

/* ------------------------------- DELETAR ------------------------------- */
export async function removeVendaPagamentosController(req, res) {
    try {
        const vendaPagamentosId = parseInt(req.params.id);
        const vendaPagamentos = await vendaPagamentosService.removeVendaPagamentos(vendaPagamentosId);

        if (!vendaPagamentos) {
            return res.status(404).json({ mensagem: 'Venda_pagamentos nao encontrada' });
        }

        res.status(200).json({ mensagem: 'Venda_pagamentos deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar venda_pagamentos: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao deletar venda_pagamentos', erro: err.message });
    }
}