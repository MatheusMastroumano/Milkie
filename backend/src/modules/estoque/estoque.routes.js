import express from 'express';
import * as estoqueController from './estoque.controller.js';
import estoqueSchema from './estoque.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('estoque'));

router.get('/', estoqueController.getEstoqueController);
router.get('/:produtoId/:lojaId', estoqueController.getEstoqueByIdController);
router.post('/', validate(estoqueSchema), estoqueController.createEstoqueController);
router.put('/:produtoId/:lojaId', validate(estoqueSchema.partial()), estoqueController.updateEstoqueController);
router.delete('/:produtoId/:lojaId', estoqueController.removeEstoqueController);

export default router;