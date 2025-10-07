import * as precosService from './precos.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getPrecosController(req, res) {
    try {
        const precos = await precosService.getPrecos();
        res.status(200).json({ precos });
    } catch (err) {
        console.error('Erro ao listar preços: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar preços', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getPrecosByIdController(req, res) {
    try {
        const preco = await precosService.getPrecosById(req.params.id);

        if (!preco) {
            return res.status(404).json({ mensagem: 'Preço nao encontrado' });
        }

        res.status(200).json({ preco });
    } catch (err) {
        console.error('Erro ao buscar preços por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar preços por id', erro: err.message });
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createPrecosController(req, res) {
    try {
        const { lojaId, produtoId, preco, valido_de, valido_ate } = req.body;

        const precoData = { lojaId, produtoId, preco, valido_de, valido_ate };

        const precoCriado = await precosService.createPrecos(precoData);

        res.status(201).json({ mensagem: 'Preço criado com sucesso', precoCriado });
    } catch (err) {
        console.error('Erro ao criar preços: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar preços: ', err });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updatePrecosController(req, res) {
    try {
        const precoId = parseInt(req.params.id);
        const preco = await precosService.getPrecosById(precoId);

        if (!preco) {
            return res.status(404).json({ mensagem: 'Preço nao encontrado' });
        }

        const { lojaId, produtoId, preco: novoPreco } = req.body;

        const precoData = { lojaId, produtoId, preco: novoPreco };

        const precoAtualizado = await precosService.updatePrecos(precoId, precoData);

        res.status(200).json({ mensagem: 'Preço atualizado com sucesso', precoAtualizado });
    } catch (err) {
        console.error('Erro ao atualizar preços: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar preços: ', err });
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removePrecosController(req, res) {
    try {
        const precoId = req.params.id;
        const preco = await precosService.getPrecosById(precoId);

        if (!preco) {
            return res.status(404).json({ mensagem: 'Preço nao encontrado' });
        }

        await precosService.removePrecos(precoId);
        res.status(200).json({ mensagem: 'Preço removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover preços: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover preços: ', err });
    }
}
