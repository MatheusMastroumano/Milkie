import * as fornecedorProdutosService from './fornecedorProdutos.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getFornecedorProdutosController(req, res) {
    try {
        const fornecedorProdutos = await fornecedorProdutosService.getFornecedorProdutos();
        res.status(200).json({ fornecedorProdutos });
    } catch (err) {
        console.error('Erro ao listar fornecedor_produtos: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar fornecedor_produtos', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getFornecedorProdutosByIdController(req, res) {
    try {
        const fornecedorProdutos = await fornecedorProdutosService.getFornecedorProdutosById(req.params.id);

        if (!fornecedorProdutos) {
            return res.status(404).json({ mensagem: 'Ligaçao entre fornecedor e produto não encontrada' });
        }

        res.status(200).json({ fornecedorProdutos });
    } catch (err) {
        console.error('Erro ao buscar fornecedor_produtos por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar fornecedor_produtos por id', erro: err.message });
    }
}

/* ------------------------------ CRIAR ----------------------------- */
export async function createFornecedorProdutosController(req, res) {
    try {
        const { fornecedor_id, produto_id } = req.body;

        const fornecedorProdutosData = { fornecedor_id, produto_id };

        const fornecedorProdutos = await fornecedorProdutosService.createFornecedorProdutos(fornecedorProdutosData);
        res.status(201).json({ fornecedorProdutos });
    } catch (err) {
        console.error('Erro ao criar fornecedor_produtos: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar fornecedor_produtos', erro: err.message });
    }
}

/* ------------------------------ ATUALIZAR ----------------------------- */
export async function updateFornecedorProdutosController(req, res) {
    try {
        const fornecedorProdutosId = parseInt(req.params.id);
        const fornecedorProdutos = await fornecedorProdutosService.getFornecedorProdutosById(fornecedorProdutosId);

        if (!fornecedorProdutos) {
            return res.status(404).json({ mensagem: 'Ligaçao entre fornecedor e produto nao encontrada' });
        }

        const { fornecedor_id, produto_id } = req.body;

        const fornecedorProdutosData = { fornecedor_id, produto_id };

        const updatedFornecedorProdutos = await fornecedorProdutosService.updateFornecedorProdutos(fornecedorProdutosId, fornecedorProdutosData);
        res.status(200).json({ updatedFornecedorProdutos });
    } catch (err) {
        console.error('Erro ao atualizar fornecedor_produtos: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar fornecedor_produtos', erro: err.message });
    }
}

/* ------------------------------ REMOVER ----------------------------- */
export async function removeFornecedorProdutosController(req, res) {
    try {
        const fornecedorProdutosId = parseInt(req.params.id);
        const fornecedorProdutos = await fornecedorProdutosService.getFornecedorProdutosById(fornecedorProdutosId);

        if (!fornecedorProdutos) {
            return res.status(404).json({ mensagem: 'Ligaçao entre fornecedor e produto nao encontrada' });
        }

        await fornecedorProdutosService.removeFornecedorProdutos(fornecedorProdutosId);
        res.status(200).json({ fornecedorProdutos });
    } catch (err) {
        console.error('Erro ao remover fornecedor_produtos: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover fornecedor_produtos', erro: err.message });
    }
}