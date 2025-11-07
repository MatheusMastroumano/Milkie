import express from 'express';
import * as vendaPagamentosController from './vendaPagamentos.controller.js';
import vendaPagamentosSchema from './vendaPagamentos.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('venda_pagamentos'));

router.get('/', vendaPagamentosController.getVendaPagamentosController);
router.get('/:id', vendaPagamentosController.getVendaPagamentosByIdController);
router.post('/', validate(vendaPagamentosSchema), vendaPagamentosController.createVendaPagamentosController);
router.put('/:id', validate(vendaPagamentosSchema.partial()), vendaPagamentosController.updateVendaPagamentosController);
router.delete('/:id', vendaPagamentosController.removeVendaPagamentosController);

export default router;