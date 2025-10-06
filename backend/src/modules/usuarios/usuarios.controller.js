import * as usuariosService from './usuarios.service.js';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getUsuariosController(req, res) {
    try {
        const usuarios = await usuariosService.getUsuarios();
        res.status(200).json({ usuarios });
    } catch (err) {
        console.error('Erro ao listar usuários: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao listar usuários', erro: err.message });
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getUsuariosByIdController(req, res) {
    try {
        const usuario = await usuariosService.getUsuarioById(req.params.id);

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.status(200).json({ usuario });
    } catch (err) {
        console.error('Erro ao buscar usuário por id: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao buscar usuário por id', erro: err.message });
    }
}

/* ---------------------------------- CRIAR --------------------------------- */
export async function createUsuariosController(req, res) {
    try {
        const { funcionario_id, loja_id, funcao, username, senha_hash, ativo } = req.body;

        const usuarioData = { funcionario_id, loja_id, funcao, username, senha_hash, ativo };

        const usuario = await usuariosService.createUsuario(usuarioData);

        res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario });
    } catch (err) {
        console.error('Erro ao criar usuário: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao criar usuário', erro: err.message });
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateUsuariosController(req, res) {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuario = await usuariosService.getUsuarioById(usuarioId);

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        const { funcionario_id, loja_id, funcao, username, senha_hash, ativo } = req.body;

        const usuarioData = { funcionario_id, loja_id, funcao, username, senha_hash, ativo };
        
        // Remover campos undefined
        Object.keys(usuarioData).forEach(key => {
            if (usuarioData[key] === undefined) {
                delete usuarioData[key];
            }
        });

        const updatedUsuario = await usuariosService.updateUsuario(usuarioId, usuarioData);

        res.status(200).json({ mensagem: 'Usuário atualizado com sucesso', usuario: updatedUsuario });
    } catch (err) {
        console.error('Erro ao atualizar usuário: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário', erro: err.message });
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeUsuariosController(req, res) {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuario = await usuariosService.getUsuarioById(usuarioId);

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        await usuariosService.removeUsuario(usuarioId);
        res.status(200).json({ mensagem: 'Usuário removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover usuário: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao remover usuário', erro: err.message });
    }
}