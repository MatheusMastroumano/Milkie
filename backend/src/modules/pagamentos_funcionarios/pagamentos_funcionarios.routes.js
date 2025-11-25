import express from 'express';
import * as pagamentosFuncionariosController from './pagamentos_funcionarios.controller.js';
import pagamentosFuncionariosSchema from './pagamentos_funcionarios.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('financeiro'));

router.get('/', pagamentosFuncionariosController.getPagamentosFuncionariosController);
router.get('/:id', pagamentosFuncionariosController.getPagamentoFuncionarioByIdController);
router.post('/', validate(pagamentosFuncionariosSchema), pagamentosFuncionariosController.createPagamentoFuncionarioController);
router.put('/:id', validate(pagamentosFuncionariosSchema.partial()), pagamentosFuncionariosController.updatePagamentoFuncionarioController);
router.delete('/:id', pagamentosFuncionariosController.removePagamentoFuncionarioController);

export default router;

