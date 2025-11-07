import * as vendasService from './vendas.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getVendasController(req, res) {
    try {
        const vendas = await vendasService.getVendas();
        res.status(200).json({ vendas });
    } catch (err) {
        console.error('Erro ao listar vendas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar vendas', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getVendasByIdController(req, res) {
    try {
        const venda = await vendasService.getVendasById(req.params.id);

        if (!venda) {
            return res.status(404).json({ mensagem: 'Venda nao encontrada' });
        }

        res.status(200).json({ venda });
    } catch (err) {
        console.error('Erro ao buscar venda por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar venda por id', erro: err.message });
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createVendasController(req, res) {
    try {
        const { loja_id, usuario_id, comprador_cpf, valor_total } = req.body;

        const vendaData = { loja_id, usuario_id, comprador_cpf, valor_total };

        const venda = await vendasService.createVendas(vendaData);

        res.status(201).json({ venda });
    } catch (err) {
        console.error('Erro ao criar venda: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar venda', erro: err.message });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateVendasController(req, res) {
    try {
        const vendaId = parseInt(req.params.id);
        const venda = await vendasService.getVendasById(vendaId);

        if (!venda) {
            return res.status(404).json({ mensagem: 'Venda nao encontrada' });
        }

        const { loja_id, usuario_id, comprador_cpf, valor_total } = req.body;

        const vendaData = { loja_id, usuario_id, comprador_cpf, valor_total };

        const updatedVenda = await vendasService.updateVendas(vendaId, vendaData);

        res.status(200).json({ mensagem: 'Venda atualizada com sucesso', updatedVenda });
    } catch (err) {
        console.error('Erro ao atualizar venda: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar venda', erro: err.message });
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeVendasController(req, res) {
    try {
        const vendaId = parseInt(req.params.id);
        const venda = await vendasService.getVendasById(vendaId);

        if (!venda) {
            return res.status(404).json({ mensagem: 'Venda nao encontrada' });
        }

        await vendasService.removeVendas(vendaId);
        res.status(200).json({ mensagem: 'Venda removida com sucesso' });
    } catch (err) {
        console.error('Erro ao remover venda: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover venda', erro: err.message });
    }
}

/* ------------------------------- FINALIZAR ------------------------------- */
export async function finalizarVendaController(req, res) {
    try {
        const { loja_id, usuario_id, itens, comprador_cpf, metodo_pagamento } = req.body;

        if (!loja_id || !usuario_id) {
            return res.status(400).json({ mensagem: 'loja_id e usuario_id são obrigatórios' });
        }

        const resultado = await vendasService.finalizarVenda({ loja_id, usuario_id, itens, comprador_cpf, metodo_pagamento });
        return res.status(201).json(resultado);
    } catch (err) {
        console.error('Erro ao finalizar venda: ', err.message);
        res.status(400).json({ mensagem: err.message });
    }
}