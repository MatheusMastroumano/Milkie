import * as caixaService from './caixa.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getCaixasController(req, res) {
    try {
        const caixas = await caixaService.getCaixas();
        res.status(200).json({ caixas });
    } catch (err) {
        console.error('Erro ao listar caixas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar caixas', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getCaixasByIdController(req, res) {
    try {
        const caixas = await caixaService.getCaixasById(req.params.id);

        if (!caixas) {
            return res.status(404).json({ mensagem: 'Caixa nao encontrada' });
        }

        res.status(200).json({ caixas });
    } catch (err) {
        console.error('Erro ao buscar caixas por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar caixas por id', erro: err.message });
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createCaixasController(req, res) {
    try {
        const { loja_id, aberto_por, aberto_em, fechado_por, fechado_em, valor_inicial, valor_final, status } = req.body;

        const caixaData = { loja_id, aberto_por, aberto_em, fechado_por, fechado_em, valor_inicial, valor_final, status };

        if (!caixaData.loja_id) {
            return res.status(400).json({ mensagem: 'Loja nao informada' });
        }

        if (!caixaData.aberto_por) {
            return res.status(400).json({ mensagem: 'Aberto por nao informado' });
        }

        if (!caixaData.fechado_por) {
            return res.status(400).json({ mensagem: 'Fechado por nao informado' });
        }

        const caixa = await caixaService.createCaixas(caixaData);
        res.status(201).json({ caixa });
    } catch (err) {
        console.error('Erro ao criar caixas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar caixas', erro: err.message });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateCaixasController(req, res) {
    try {
        const caixaId = parseInt(req.params.id);
        const caixa = await caixaService.getCaixasById(caixaId);

        const { loja_id, aberto_por, aberto_em, fechado_por, fechado_em, valor_inicial, valor_final, status } = req.body;

        if (!caixa) {
            return res.status(404).json({ mensagem: 'Caixa nao encontrada' });
        }

        if (!caixaData.loja_id) {
            return res.status(400).json({ mensagem: 'Loja nao informada' });
        }

        if (!caixaData.aberto_por) {
            return res.status(400).json({ mensagem: 'Aberto por nao informado' });
        }

        if (!caixaData.fechado_por) {
            return res.status(400).json({ mensagem: 'Fechado por nao informado' });
        }

        const caixaData = { loja_id, aberto_por, aberto_em, fechado_por, fechado_em, valor_inicial, valor_final, status };


        const updatedCaixa = await caixaService.updateCaixas(caixaId, caixaData);
        res.status(200).json({ caixa: updatedCaixa });
    } catch (err) {
        console.error('Erro ao atualizar caixas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar caixas', erro: err.message });
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeCaixasController(req, res) {
    try {
        const caixaId = parseInt(req.params.id);
        const caixa = await caixaService.getCaixasById(caixaId);

        if (!caixa) {
            return res.status(404).json({ mensagem: 'Caixa nao encontrada' });
        }

        await caixaService.removeCaixas(caixaId);
        res.status(200).json({ mensagem: 'Caixa removida com sucesso' });
    } catch (err) {
        console.error('Erro ao remover caixas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover caixas', erro: err.message });
    }
}