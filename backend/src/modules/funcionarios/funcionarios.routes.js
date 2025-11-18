import express from 'express';
import * as funcionariosController from './funcionarios.controller.js';
import { uploadImagem, uploadImagemController } from './funcionarios.upload.controller.js';
import funcionarioSchema from './funcionarios.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('funcionarios'));

// Rota de upload de imagem (antes das outras rotas)
router.post('/upload-imagem', uploadImagem, uploadImagemController);

router.get('/', funcionariosController.getFuncionariosController);
router.get('/:id', funcionariosController.getFuncionariosByIdController);
router.post('/', validate(funcionarioSchema), funcionariosController.createFuncionariosController);
router.put('/:id', validate(funcionarioSchema.partial()), funcionariosController.updateFuncionariosController);
router.delete('/:id', funcionariosController.removeFuncionariosController);

export default router;