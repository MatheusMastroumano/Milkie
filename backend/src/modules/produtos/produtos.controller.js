import * as produtosService from './produtos.service.js';

import uploadImagem from '../../shared/utils/uploadSupabase.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getProdutosController(req, res) {
    try {
        const produtos = await produtosService.getProdutos();
        res.status(200).json({ produtos });
    } catch (err) {
        console.error('Erro ao listar produtos: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar produtos', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getProdutosByIdController(req, res) {
    try {
        const produto = await produtosService.getProdutosById(req.params.id);

        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto nao encontrado' });
        }

        res.status(200).json({ produto });
    } catch (err) {
        console.error('Erro ao buscar produto por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar produto por id', erro: err.message });
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createProdutosController(req, res) {
    try {
        const { nome, marca, categoria, descricao, sku, fabricacao, validade, ativo } = req.body;
        const imagem = req.files?.imagem;

        const imagemUrl = await uploadImagem(imagem, 'produtos');

        const produtoData = { nome, imagemUrl, marca, categoria, descricao, sku, fabricacao, validade, ativo };

        const produto = await produtosService.createProdutos(produtoData);

        res.status(201).json({ mensagem: 'Produto criado com sucesso', produto });
    } catch (err) {
        console.error('Erro ao criar produto: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar produto: ', err });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateProdutosController(req, res) {
    try {
        const produtoId = parseInt(req.params.id);
        const produto = await produtosService.getProdutosById(produtoId);

        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto nao encontrado' });
        }

        const { nome, marca, categoria, descricao, sku, ativo, imagem_url } = req.body;

        const produtoData = { nome, marca, categoria, descricao, sku, ativo, imagem_url };

        const updatedProduto = await produtosService.updateProdutos(produtoId, produtoData);

        res.status(200).json({ mensagem: 'Produto atualizado com sucesso', updatedProduto });
    } catch (err) {
        console.error('Erro ao atualizar produto: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar produto: ', erro: err.message });
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeProdutosController(req, res) {
    try {
        const produtoId = req.params.id;
        const produto = await produtosService.getProdutosById(produtoId);

        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto nao encontrado' });
        }

        await produtosService.removeProdutos(produtoId);
        res.status(200).json({ mensagem: 'Produto removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover produto: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover produto: ', erro: err.message });
    }
}
