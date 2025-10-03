const validate = (schema) => (req, res, next) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ mensagem: parsed.error.format() });
    }

    req.body = parsed.data 
    return next();
};

export default validate;
