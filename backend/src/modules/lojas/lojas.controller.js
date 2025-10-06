import * as lojasService from './lojas.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getLojasController(req, res) {
    try {
        const lojas = await lojasService.getLojas();
        res.status(200).json({ lojas });
    } catch (err) {
        console.error('Erro ao listar lojas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar lojas', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getLojasByIdController(req, res) {
    try {
        const loja = await lojasService.getLojasById(req.params.id);

        if (!loja) {
            return res.status(404).json({ mensagem: 'Loja nao encontrada' });
        }

        res.status(200).json({ loja });
    } catch (err) {
        console.error('Erro ao buscar loja por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar loja por id', erro: err.message });
    }
}

/* ------------------------------- CRIAR ------------------------------- */
export async function createLojasController(req, res) {
    try {
        const { nome, tipo, CEP, ativo } = req.body;

        const lojaData = { nome, tipo, CEP, ativo };

        const loja = await lojasService.createLojas(lojaData);

        res.status(201).json({ mensagem: 'Loja criada com sucesso', loja });
    } catch (err) {
        console.error('Erro ao criar lojas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar lojas: ', err });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateLojasController(req, res) {
    try {
        const lojaId = parseInt(req.params.id);
        const loja = await lojasService.getLojasById(lojaId);

        if (!loja) {
            return res.status(404).json({ mensagem: 'Loja nao encontrada' });
        }

        const { nome, tipo, CEP, ativo } = req.body;

        const lojaData = { nome, tipo, CEP, ativo };

        const updatedLoja = await lojasService.updateLojas(lojaId, lojaData);

        res.status(200).json({ mensagem: 'Loja atualizada com sucesso', updatedLoja });
    } catch (err) {
        console.error('Erro ao criar lojas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar lojas: ', err });
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeLojasController(req, res) {
    try {
        const lojaId = req.params.id;
        const loja = await lojasService.getLojasById(lojaId);

        if (!loja) {
            return res.status(404).json({ mensagem: 'Loja nao encontrada' });
        }

        await lojasService.removeLojas(lojaId);
        res.status(200).json({ mensagem: 'Loja removida com sucesso' });
    } catch (err) {
        console.error('Erro ao criar lojas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar lojas: ', err });
    }
}
