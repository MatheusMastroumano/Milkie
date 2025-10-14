import express from 'express';
import * as fornecedorProdutosController from './fornecedorProdutos.controller.js';
import fornecedorProdutosSchema from './fornecedorProdutos.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';

const router = express.Router();

router.get('/', fornecedorProdutosController.getFornecedorProdutosController);
router.get('/:id', fornecedorProdutosController.getFornecedorProdutosByIdController);
router.post('/', validate(fornecedorProdutosSchema), fornecedorProdutosController.createFornecedorProdutosController);
router.put('/:id', validate(fornecedorProdutosSchema.partial()), fornecedorProdutosController.updateFornecedorProdutosController);
router.delete('/:id', fornecedorProdutosController.removeFornecedorProdutosController);

export default router;