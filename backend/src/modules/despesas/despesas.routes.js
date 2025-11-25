import express from 'express';
import * as despesasController from './despesas.controller.js';
import despesasSchema from './despesas.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('financeiro'));

router.get('/', despesasController.getDespesasController);
router.get('/:id', despesasController.getDespesaByIdController);
router.post('/', validate(despesasSchema), despesasController.createDespesaController);
router.put('/:id', validate(despesasSchema.partial()), despesasController.updateDespesaController);
router.delete('/:id', despesasController.removeDespesaController);

export default router;

