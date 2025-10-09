import express from 'express';
import * as funcionariosController from './estoque.controller.js';
import estoqueSchema from './estoque.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';

const router = express.Router();

router.get('/', funcionariosController.getEstoqueController);
router.get('/:id', funcionariosController.getEstoqueByIdController);
router.post('/', validate(estoqueSchema), funcionariosController.createEstoqueController);
router.put('/:id', validate(estoqueSchema.partial()), funcionariosController.updateEstoqueController);
router.delete('/:id', funcionariosController.removeEstoqueController);

export default router;