import * as vendaItensService from './vendaItens.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getVendaItensController(req, res) {
    try {
        const vendaItens = await vendaItensService.getVendaItens();
        res.status(200).json({ vendaItens });
    } catch (err) {
        console.error('Erro ao listar venda_itens: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar venda_itens', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getVendaItensByIdController(req, res) {
    try {
        const vendaItens = await vendaItensService.getVendaItensById(req.params.id);

        if (!vendaItens) {
            return res.status(404).json({ mensagem: 'Venda_itens nao encontrada' });
        }

        res.status(200).json({ vendaItens });
    } catch (err) {
        console.error('Erro ao listar venda_itens por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar venda_itens por id', erro: err.message });
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createVendaItensController(req, res) {
    try {
        const { venda_id, produto_id, quantidade, preco_unitario, subtotal } = req.body;

        const vendaItensData = { venda_id, produto_id, quantidade, preco_unitario, subtotal };

        const vendaItens = await vendaItensService.createVendaItens(vendaItensData);
        res.status(201).json({ vendaItens });
    } catch (err) {
        console.error('Erro ao criar venda_itens: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar venda_itens', erro: err.message });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateVendaItensController(req, res) {
    try {
        const vendaItensId = parseInt(req.params.id);
        const vendaItens = await vendaItensService.getVendaItensById(vendaItensId);

        if (!vendaItens) {
            return res.status(404).json({ mensagem: 'Venda_itens nao encontrada' });
        }

        const { venda_id, produto_id, quantidade, preco_unitario, subtotal } = req.body;

        const vendaItensData = { venda_id, produto_id, quantidade, preco_unitario, subtotal };

        const updatedVendaItens = await vendaItensService.updateVendaItens(vendaItensId, vendaItensData);

        res.status(200).json({ mensagem: 'Venda_itens atualizado com sucesso', updatedVendaItens });
    } catch (err) {
        console.error('Erro ao atualizar venda_itens: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar venda_itens', erro: err.message });
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeVendaItensController(req, res) {
    try {
        const vendaItensId = parseInt(req.params.id);
        const vendaItens = await vendaItensService.getVendaItensById(vendaItensId);

        if (!vendaItens) {
            return res.status(404).json({ mensagem: 'Venda_itens nao encontrada' });
        }

        await vendaItensService.removeVendaItens(vendaItensId);
        res.status(200).json({ mensagem: 'Venda_itens removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover venda_itens: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover venda_itens', erro: err.message });
    }
}