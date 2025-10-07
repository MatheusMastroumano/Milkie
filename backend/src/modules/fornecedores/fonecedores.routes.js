import express from 'express';
import * as fornecedoresController from './fornecedores.controller.js'
import fornecedoreSchema from './fornecedores.schema.js'

import validate from '../../shared/middlewares/validate.js'

const router = express.Router()

router.get('/', fornecedoresController.getFornecedoresController);
router.get('/:id', fornecedoresController.getFornecedoresByIdController);
router.post('/', validate(fornecedoreSchema), fornecedoresController.createFornecedoresController);
router.put('/:id', validate(fornecedoreSchema.partial()), fornecedoresController.updateFornecedoresController);
router.delete('/:id', fornecedoresController.removeFornecedoresController);

export default router;