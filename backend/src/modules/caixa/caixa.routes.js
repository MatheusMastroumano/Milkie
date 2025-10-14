import express from 'express';
import * as vendaPagamentosController from './vendaPagamentos.controller.js';
import vendaPagamentosSchema from './vendaPagamentos.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';

const router = express.Router();

router.get('/', vendaPagamentosController.getVendaPagamentosController);
router.get('/:id', vendaPagamentosController.getVendaPagamentosByIdController);
router.post('/', validate(vendaPagamentosSchema), vendaPagamentosController.createVendaPagamentosController);
router.put('/:id', validate(vendaPagamentosSchema.partial()), vendaPagamentosController.updateVendaPagamentosController);
router.delete('/:id', vendaPagamentosController.removeVendaPagamentosController);

export default router;