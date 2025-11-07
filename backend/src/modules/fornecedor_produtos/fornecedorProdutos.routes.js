import express from 'express';
import * as fornecedorProdutosController from './fornecedorProdutos.controller.js';
import fornecedorProdutosSchema from './fornecedorProdutos.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('fornecedor_produtos'));

router.get('/', fornecedorProdutosController.getFornecedorProdutosController);
router.get('/:id', fornecedorProdutosController.getFornecedorProdutosByIdController);
router.post('/', validate(fornecedorProdutosSchema), fornecedorProdutosController.createFornecedorProdutosController);
router.put('/:id', validate(fornecedorProdutosSchema.partial()), fornecedorProdutosController.updateFornecedorProdutosController);
router.delete('/:id', fornecedorProdutosController.removeFornecedorProdutosController);

export default router;