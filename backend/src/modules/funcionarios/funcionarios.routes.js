import express from 'express';
import * as funcionariosController from './funcionarios.controller.js';
import funcionarioSchema from './funcionarios.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('funcionarios'));

router.get('/', funcionariosController.getFuncionariosController);
router.get('/:id', funcionariosController.getFuncionariosByIdController);
router.post('/', validate(funcionarioSchema), funcionariosController.createFuncionariosController);
router.put('/:id', validate(funcionarioSchema.partial()), funcionariosController.updateFuncionariosController);
router.delete('/:id', funcionariosController.removeFuncionariosController);

export default router;