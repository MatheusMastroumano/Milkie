import express from 'express';
import * as vendaItensController from './vendaItens.controller.js';
import vendaItensSchema from './vendaItens.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('venda_itens'));

router.get('/', vendaItensController.getVendaItensController);
router.get('/:id', vendaItensController.getVendaItensByIdController);
router.post('/', validate(vendaItensSchema), vendaItensController.createVendaItensController);
router.put('/:id', validate(vendaItensSchema.partial()), vendaItensController.updateVendaItensController);
router.delete('/:id', vendaItensController.removeVendaItensController);

export default router;