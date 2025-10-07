import express from 'express';
import * as precosController from './precos.controller.js';
import precosSchema from './precos.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';

const router = express.Router();

router.get('/', precosController.getPrecosController);
router.get('/:id', precosController.getPrecosByIdController);
router.post('/', validate(precosSchema), precosController.createPrecosController);
router.put('/:id', validate(precosSchema.partial()), precosController.updatePrecosController);
router.delete('/:id', precosController.removePrecosController);

export default router;