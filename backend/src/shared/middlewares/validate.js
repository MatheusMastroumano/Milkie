/* 
    esse é um middleware de validação do zod, deve ser chamado
    em qualquer rota que adicione algo (post, put)
*/

const validate = (schema) => (req, res, next) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.errors.map(err => {
            const path = err.path.join('.');
            return `${path}: ${err.message}`;
        }).join(', ');
        return res.status(400).json({ mensagem: `Erro de validação: ${errors}`, erro: errors });
    }

    req.body = parsed.data
    return next();
};

export default validate;
