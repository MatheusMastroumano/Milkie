import express from 'express';
import * as funcionariosController from './funcionarios.controller.js';

const router = express.Router();

router.get('/', funcionariosController.getFuncionariosController);
router.get('/:id', funcionariosController.getFuncionariosByIdController);
router.post('/', funcionariosController.createFuncionariosController);
router.put('/:id', funcionariosController.updateFuncionariosController);
router.delete('/:id', funcionariosController.removeFuncionariosController);

export default router;