import express from 'express';
import * as fornecedoresController from './fornecedores.controller.js'
import fornecedoreSchema from './fornecedores.schema.js'

// importação de middlewares
import validate from '../../shared/middlewares/validate.js'
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router()

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('fornecedores'));

router.get('/', fornecedoresController.getFornecedoresController);
router.get('/:id', fornecedoresController.getFornecedoresByIdController);
router.post('/', validate(fornecedoreSchema), fornecedoresController.createFornecedoresController);
router.put('/:id', validate(fornecedoreSchema.partial()), fornecedoresController.updateFornecedoresController);
router.delete('/:id', fornecedoresController.removeFornecedoresController);

export default router;