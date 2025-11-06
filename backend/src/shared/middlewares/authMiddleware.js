import jwt from 'jsonwebtoken';
import JWT_SECRET from '../config/jwt.js';

export default function authMiddleware(req, res, next) {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ authenticated: false, erro: 'Token não encontrado' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ authenticated: false, erro: 'Token inválido ou expirado' });
    }
}
