import express from 'express';
import * as caixaController from './caixa.controller.js';
import caixaSchema from './caixa.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';

const router = express.Router();

router.get('/', caixaController.getCaixasController);
router.get('/:id', caixaController.getCaixasByIdController);
router.post('/', validate(caixaSchema), caixaController.createCaixasController);
router.put('/:id', validate(caixaSchema.partial()), caixaController.updateCaixasController);
router.delete('/:id', caixaController.removeCaixasController);

/* -------------------------------------------------------------------------- */
/*                                   EXEMPLO                                  */
/* -------------------------------------------------------------------------- */
// router.delete('/:id', authMiddleware, moduleAccess('caixa'), caixaController.removeCaixasController);
// todas as rotas de todos os módulos têm que ter esse dois middlewares, como nome do módulo

export default router;