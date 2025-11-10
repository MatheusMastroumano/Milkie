import 'dotenv/config';
import JWT_SECRET from '../../shared/config/jwt.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../shared/config/database.js';

/* ---------------------------------- LOGIN --------------------------------- */
export async function loginController(req, res) {
    const { username, senha } = req.body;

    try {
        const usuario = await prisma.usuarios.findUnique({ where: { username } });

        if (!usuario) return res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
        

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) return res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
        

        const token = jwt.sign({ id: usuario.id, funcao: usuario.funcao, username: usuario.username, loja_id: usuario.loja_id }, JWT_SECRET, { expiresIn: '8h' });

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
                loja_id: usuario.loja_id
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

        return res.json({
            authenticated: true,
            user: {
                id: decoded.id,
                funcao: decoded.funcao,
                username: decoded.username,
                loja_id: decoded.loja_id
            }
        });
    } catch (err) {
        return res.status(401).json({ authenticated: false, erro: 'token inválido ou expirado' });
    }
}