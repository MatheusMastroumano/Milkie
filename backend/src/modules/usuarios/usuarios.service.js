import prisma from '../../shared/config/database.js';
import bcrypt from 'bcrypt';

/* ------------------------------ BUSCAR TODOS ----------------------------- */
export async function getUsuarios() {
    try {
        return await prisma.usuarios.findMany({
            include: {
                funcionario: true,
                loja: true
            }
        });
    } catch (err) {
        console.error('Erro ao buscar usuários: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------ BUSCAR POR ID ----------------------------- */
export async function getUsuariosById(id) {
    try {
        return await prisma.usuarios.findUnique({
            where: { id: Number(id) },
            include: {
                funcionario: true,
                loja: true
            }
        });
    } catch (err) {
        console.error('Erro ao buscar usuário por id: ', err);
        throw new Error(err.message);
    }
}

/* ---------------------------------- CRIAR --------------------------------- */
export async function createUsuarios(data) {
    try {
        // Verificar se o funcionário existe
        const funcionarioExiste = await prisma.funcionarios.findUnique({
            where: { id: data.funcionario_id }
        });
        
        if (!funcionarioExiste) {
            throw new Error('Funcionário não encontrado');
        }
        
        // Verificar se a loja existe (se fornecida)
        if (data.loja_id) {
            const lojaExiste = await prisma.lojas.findUnique({
                where: { id: data.loja_id }
            });
            
            if (!lojaExiste) {
                throw new Error('Loja não encontrada');
            }
        }
        
        // Verificar se o username já existe
        const usernameExiste = await prisma.usuarios.findUnique({
            where: { username: data.username }
        });
        
        if (usernameExiste) {
            throw new Error('Nome de usuário já está em uso');
        }

        if (data.funcao !== 'admin' && data.funcao !== 'gerente' && data.funcao !== 'caixa') {
            throw new Error('Função inválida');
        }
        
        // Hash da senha
        const saltRounds = 10;
        const senha_hash = await bcrypt.hash(data.senha_hash, saltRounds);
        
        // Criar o usuário no banco
        return await prisma.usuarios.create({
            data: {
                ...data,
                senha_hash
            },
            include: {
                funcionario: true,
                loja: true
            }
        });
    } catch (err) {
        console.error('Erro ao criar usuário: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- ATUALIZAR ------------------------------- */
export async function updateUsuarios(id, data) {
    try {
        // Verificar se o usuário existe
        const usuarioExiste = await prisma.usuarios.findUnique({
            where: { id: Number(id) }
        });
        
        if (!usuarioExiste) {
            throw new Error('Usuário não encontrado');
        }
        
        // Se estiver atualizando o funcionário, verificar se existe
        if (data.funcionario_id) {
            const funcionarioExiste = await prisma.funcionarios.findUnique({
                where: { id: data.funcionario_id }
            });
            
            if (!funcionarioExiste) {
                throw new Error('Funcionário não encontrado');
            }
        }
        
        // Se estiver atualizando a loja, verificar se existe
        if (data.loja_id) {
            const lojaExiste = await prisma.lojas.findUnique({
                where: { id: data.loja_id }
            });
            
            if (!lojaExiste) {
                throw new Error('Loja não encontrada');
            }
        }
        
        // Se estiver atualizando o username, verificar se já existe
        if (data.username && data.username !== usuarioExiste.username) {
            const usernameExiste = await prisma.usuarios.findUnique({
                where: { username: data.username }
            });
            
            if (usernameExiste) {
                throw new Error('Nome de usuário já está em uso');
            }
        }

        if (data.funcao !== 'admin' && data.funcao !== 'gerente' && data.funcao !== 'caixa') {
            throw new Error('Função inválida');
        }
        
        // Se estiver atualizando a senha, fazer o hash
        let updateData = { ...data };
        if (data.senha_hash) {
            const saltRounds = 10;
            updateData.senha_hash = await bcrypt.hash(data.senha_hash, saltRounds);
        }
        
        // Atualizar o usuário
        return await prisma.usuarios.update({
            where: { id: id },
            data: updateData,
            include: {
                funcionario: true,
                loja: true
            }
        });
    } catch (err) {
        console.error('Erro ao atualizar usuário: ', err);
        throw new Error(err.message);
    }
}

/* ------------------------------- REMOVER ------------------------------- */
export async function removeUsuarios(id) {
    try {
        // Verificar se o usuário existe
        const usuarioExiste = await prisma.usuarios.findUnique({
            where: { id: Number(id) }
        });
        
        if (!usuarioExiste) {
            throw new Error('Usuário não encontrado');
        }
        
        // Remover o usuário
        return await prisma.usuarios.delete({
            where: { id: id }
        });
    } catch (err) {
        console.error('Erro ao remover usuário: ', err);
        throw new Error(err.message);
    }
}