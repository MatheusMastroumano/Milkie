import express from 'express';
import * as lojasController from './lojas.controller.js';
import lojasSchema from './lojas.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('lojas'));

router.get('/', lojasController.getLojasController);
router.get('/:id', lojasController.getLojasByIdController);
router.post('/', validate(lojasSchema), lojasController.createLojasController);
router.put('/:id', validate(lojasSchema.partial()), lojasController.updateLojasController);
router.delete('/:id', lojasController.removeLojasController);

export default router;