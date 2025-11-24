import 'dotenv/config';
import JWT_SECRET from '../../shared/config/jwt.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../shared/config/database.js';

/* ---------------------------------- LOGIN --------------------------------- */
export async function loginController(req, res) {
    const { username, senha } = req.body;

    try {
        const usuario = await prisma.usuarios.findUnique({
            where: { username },
            include: { funcionario: true },
        });

        if (!usuario) return res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
        

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) return res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
        

        const resolvedLojaId = usuario.loja_id ?? usuario.funcionario?.loja_id ?? null;
        const token = jwt.sign({ id: usuario.id, funcao: usuario.funcao, username: usuario.username, loja_id: resolvedLojaId }, JWT_SECRET, { expiresIn: '8h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 8 * 60 * 60 * 1000 // 8 horas
        });

        res.status(200).json({
            mensagem: 'Login realizado com sucesso',
            user: {
                id: usuario.id,
                funcao: usuario.funcao,
                username: usuario.username,
                loja_id: resolvedLojaId
            }
        });
    } catch (err) {
        console.error('Erro ao fazer login: ', err.message);
        res.status(500).json({ mensagem: 'Erro ao fazer login', erro: err.message });
    }
}

/* --------------------------------- LOGOUT --------------------------------- */
export async function logoutController(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    });

    return res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
}

/* --------------------------------- CHECK AUTH --------------------------------- */
export async function checkAuthController(req, res) {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ authenticated: false });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Buscar dados completos do usuário e funcionário
        let lojaId = decoded.loja_id ?? null;
        let funcionarioImagem = null;
        let funcionarioNome = null;

        try {
            const u = await prisma.usuarios.findUnique({
                where: { id: decoded.id },
                include: { funcionario: true },
            });
            
            if (u) {
                lojaId = u.loja_id ?? u.funcionario?.loja_id ?? lojaId;
                funcionarioImagem = u.funcionario?.imagem ?? null;
                funcionarioNome = u.funcionario?.nome ?? null;
            }
        } catch (_) {
            // ignora, retornará valores padrão
        }

        return res.json({
            authenticated: true,
            user: {
                id: decoded.id,
                funcao: decoded.funcao,
                username: decoded.username,
                loja_id: lojaId,
                funcionario_imagem: funcionarioImagem,
                funcionario_nome: funcionarioNome
            }
        });
    } catch (err) {
        return res.status(401).json({ authenticated: false, erro: 'token inválido ou expirado' });
    }
}

/* ------------------------------- CHANGE PASSWORD ------------------------------- */
export async function changePasswordController(req, res) {
    try {
        const userId = req.user?.id;
        const { senhaAtual, novaSenha } = req.body;

        if (!userId) {
            return res.status(401).json({ mensagem: 'Usuário não autenticado' });
        }

        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({ mensagem: 'Senha atual e nova senha são obrigatórias' });
        }

        if (novaSenha.length < 6) {
            return res.status(400).json({ mensagem: 'A nova senha deve ter pelo menos 6 caracteres' });
        }

        // Buscar o usuário
        const usuario = await prisma.usuarios.findUnique({
            where: { id: Number(userId) }
        });

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        // Verificar se a senha atual está correta
        const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: 'Senha atual incorreta' });
        }

        // Hash da nova senha
        const saltRounds = 10;
        const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

        // Atualizar a senha
        await prisma.usuarios.update({
            where: { id: Number(userId) },
            data: { senha_hash: novaSenhaHash }
        });

        return res.status(200).json({ mensagem: 'Senha alterada com sucesso' });
    } catch (err) {
        console.error('Erro ao alterar senha: ', err.message);
        return res.status(500).json({ mensagem: 'Erro ao alterar senha', erro: err.message });
    }
}