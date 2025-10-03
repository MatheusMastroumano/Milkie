// middlewares/validate.js
export const validate = (schema) => (req, res, next) => {
    try {
      // faz parse e substitui req.body com os dados já validados/ajustados
      req.body = schema.parse(req.body); 
      next();
    } catch (err) {
      return res.status(400).json({
        error: "Erro de validação",
        details: err.errors, // array do zod com mensagens
      });
    }
  };