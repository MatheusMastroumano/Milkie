import express from 'express';
import * as vendaItensController from './vendaItens.controller.js';
import vendaItensSchema from './vendaItens.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';

const router = express.Router();

router.get('/', vendaItensController.getVendaItensController);
router.get('/:id', vendaItensController.getVendaItensByIdController);
router.post('/', validate(vendaItensSchema), vendaItensController.createVendaItensController);
router.put('/:id', validate(vendaItensSchema.partial()), vendaItensController.updateVendaItensController);
router.delete('/:id', vendaItensController.removeVendaItensController);

export default router;