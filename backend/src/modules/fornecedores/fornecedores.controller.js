import * as fornecedoresService from './fornecedores.service.js'

// buscar fornecedores
export async function getFornecedoresController(req, res) {
    try {
        const fornecedores = await fornecedoresService.getFornecedores();
        res.status(200).json({ fornecedores });
    } catch (err) {
        console.error('Erro ao listar fornecedores: ', err.message);
        res.status(500).json({ mensagem: 'erro ao listar fornecedores: ', err });
    }
}

// burcar fornecedores por id
export async function getFornecedoresByIdController(req, res) {
    try {
        const fornecedor = await fornecedoresService.getFornecedoresById(req.params.id);

        if (!fornecedor) {
            res.status(404).json({ mensagem: "Fornecedor não encontrado" });
        }

        res.status(200).json({ fornecedor });
    } catch (err) {
        console.error('Erro ao listar fornecedor por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar o fornecedor por id: ', err });
    }
}

// Criar fornecedor
export async function createFornecedoresController(req, res) {
    try {
        const { nome, cnpj_cpf, ativo } = req.body;

        const fornecedorData = { nome, cnpj_cpf, produtos_fornecidos, ativo };

        const fornecedor = await fornecedoresService.createFornecedores(fornecedorData);

        res.status(201).json({ mensagem: 'Fornecedor criado com sucesso: ', fornecedor });
    } catch (err) {
        console.error('Erro ao criar fornecedor: ', err.message);
        res.status(500).json({ mensagem: 'erro ao criar fornecedor:', erro: err.message });
    }
}

// Atualizar fornecedor
export async function updateFornecedoresController(req, res) {
    try {
        const fornecedorId = parseInt(req.params.id);
        const fornecedor = await fornecedoresService.getFornecedoresById(fornecedorId);

        if (!fornecedor) {
            res.status(404).json({ mensagem: 'Fornecedor não encontrado' });
        }

        const { nome, cnpj_cpf, ativo, } = req.body;

        const fornecedorData = { nome, cnpj_cpf, produtos_fornecidos, ativo };

        const updatedFornecedor = await fornecedoresService.updateFornecedoresById(fornecedorId, fornecedorData)

        res.status(200).json({ mensagem: 'Fornecedor atualizado com sucesso: ', updatedFornecedor });
    } catch {
        console.error('Erro ao criar fornecedores: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar fornecedores: ', err })
    }
}

export async function removeFornecedoresController(req, res) {
    try {
        const fornecedorId = parseInt(req.params.id);
        const fornecedor = await fornecedoresService.getFornecedoresById(fornecedorId);

        if (!fornecedor) {
            res.status(404).json({ mensagem: 'Fornecedor não encontrado' });
        }

        await fornecedoresService.removeFornecedores(fornecedorId);
        res.status(200).json({mensagem: 'Fornecedor removido com sucesso'});
    } catch (err) {
        console.error('Erro remover fornecedor: ', err.message);
        res.status(500).json({mensagem: 'Erro ao criar fornecdor: ', err})
    }
}