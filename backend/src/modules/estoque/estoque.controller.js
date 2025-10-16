import * as estoqueService from './estoque.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getEstoqueController(req, res) {
    try {
        const estoque = await estoqueService.getEstoque();
        res.status(200).json({ estoque });
    } catch (err) {
        console.error('Erro ao listar estoque: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar estoque', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getEstoqueByIdController(req, res) {
    try {
        const { produtoId, lojaId } = req.params;

        const estoque = await estoqueService.getEstoqueById(produtoId, lojaId);

        if (!estoque) {
            return res.status(404).json({ mensagem: 'Estoque não encontrado' });
        }

        res.status(200).json({ estoque });
    } catch (err) {
        console.error('Erro ao buscar estoque: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar estoque', erro: err.message });
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createEstoqueController(req, res) {
    try {
        const { produto_id, loja_id, quantidade } = req.body;

        const estoqueData = { produto_id, loja_id, quantidade };

        const estoque = await estoqueService.createEstoque(estoqueData);

        res.status(201).json({ estoque });
    } catch (err) {
        console.error('Erro ao criar estoque: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar estoque', erro: err.message });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateEstoqueController(req, res) {
    try {
        const { produtoId, lojaId } = req.params;
        const { quantidade } = req.body;

        const estoqueAtualizado = await estoqueService.updateEstoque(produtoId, lojaId, { quantidade });

        if (!estoqueAtualizado) {
            return res.status(404).json({ mensagem: 'Estoque não encontrado' });
        }

        res.status(200).json({ mensagem: 'Estoque atualizado com sucesso', estoqueAtualizado });
    } catch (err) {
        console.error('Erro ao atualizar estoque: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar estoque', erro: err.message });
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeEstoqueController(req, res) {
    try {
        const { produtoId, lojaId } = req.params;

        const estoqueRemovido = await estoqueService.deleteEstoque(produtoId, lojaId);

        if (!estoqueRemovido) {
            return res.status(404).json({ mensagem: 'Estoque não encontrado' });
        }

        res.status(200).json({ mensagem: 'Estoque removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover estoque: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover estoque', erro: err.message });
    }
}