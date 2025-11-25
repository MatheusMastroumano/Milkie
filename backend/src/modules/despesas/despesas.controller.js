import * as despesasService from './despesas.service.js'

// buscar todas as despesas
export async function getDespesasController(req, res) {
    try {
        const despesas = await despesasService.getDespesas();
        res.status(200).json({ despesas });
    } catch (err) {
        console.error('Erro ao listar despesas: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar despesas', erro: err.message });
    }
}

// buscar despesa por id
export async function getDespesaByIdController(req, res) {
    try {
        const despesa = await despesasService.getDespesaById(req.params.id);

        if (!despesa) {
            return res.status(404).json({ mensagem: "Despesa não encontrada" });
        }

        res.status(200).json({ despesa });
    } catch (err) {
        console.error('Erro ao buscar despesa por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar despesa por id', erro: err.message });
    }
}

// criar despesa
export async function createDespesaController(req, res) {
    try {
        const { loja_id, descricao, valor, data, categoria, status } = req.body;

        console.log('Dados recebidos para criar despesa:', { loja_id, descricao, valor, data, categoria, status });

        const despesaData = { loja_id, descricao, valor, data, categoria, status };

        const despesa = await despesasService.createDespesa(despesaData);

        res.status(201).json({ mensagem: 'Despesa criada com sucesso', despesa });
    } catch (err) {
        console.error('Erro ao criar despesa: ', err);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ mensagem: 'Erro ao criar despesa', erro: err.message });
    }
}

// atualizar despesa
export async function updateDespesaController(req, res) {
    try {
        const despesaId = parseInt(req.params.id);
        const despesa = await despesasService.getDespesaById(despesaId);

        if (!despesa) {
            return res.status(404).json({ mensagem: 'Despesa não encontrada' });
        }

        const { loja_id, descricao, valor, data, categoria, status } = req.body;

        const despesaData = { loja_id, descricao, valor, data, categoria, status };

        const updatedDespesa = await despesasService.updateDespesaById(despesaId, despesaData);

        res.status(200).json({ mensagem: 'Despesa atualizada com sucesso', despesa: updatedDespesa });
    } catch (err) {
        console.error('Erro ao atualizar despesa: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar despesa', erro: err.message });
    }
}

// remover despesa
export async function removeDespesaController(req, res) {
    try {
        const despesaId = parseInt(req.params.id);
        const despesa = await despesasService.getDespesaById(despesaId);

        if (!despesa) {
            return res.status(404).json({ mensagem: 'Despesa não encontrada' });
        }

        await despesasService.removeDespesa(despesaId);
        res.status(200).json({ mensagem: 'Despesa removida com sucesso' });
    } catch (err) {
        console.error('Erro ao remover despesa: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover despesa', erro: err.message });
    }
}

