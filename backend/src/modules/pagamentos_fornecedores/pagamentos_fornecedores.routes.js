import express from 'express';
import * as pagamentosFornecedoresController from './pagamentos_fornecedores.controller.js';
import pagamentosFornecedoresSchema from './pagamentos_fornecedores.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('financeiro'));

router.get('/', pagamentosFornecedoresController.getPagamentosFornecedoresController);
router.get('/:id', pagamentosFornecedoresController.getPagamentoFornecedorByIdController);
router.post('/', validate(pagamentosFornecedoresSchema), pagamentosFornecedoresController.createPagamentoFornecedorController);
router.put('/:id', validate(pagamentosFornecedoresSchema.partial()), pagamentosFornecedoresController.updatePagamentoFornecedorController);
router.delete('/:id', pagamentosFornecedoresController.removePagamentoFornecedorController);

export default router;

