import express from 'express';
import * as vendasController from './vendas.controller.js';
import vendasSchema from './vendas.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';

const router = express.Router();

router.get('/', vendasController.getVendasController);
router.get('/:id', vendasController.getVendasByIdController);
router.post('/', validate(vendasSchema), vendasController.createVendasController);
router.post('/finalizar', vendasController.finalizarVendaController);
router.put('/:id', validate(vendasSchema.partial()), vendasController.updateVendasController);
router.delete('/:id', vendasController.removeVendasController);

export default router;