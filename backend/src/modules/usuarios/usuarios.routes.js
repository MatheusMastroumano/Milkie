import express from 'express';
import * as usuariosController from './usuarios.controller.js';
import UsuariosSchema from './usuarios.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';

const router = express.Router();

router.get('/', usuariosController.getUsuariosController);
router.get('/:id', usuariosController.getUsuariosByIdController);
router.post('/', validate(UsuariosSchema), usuariosController.createUsuariosController);
router.put('/:id', validate(UsuariosSchema.partial()), usuariosController.updateUsuariosController);
router.delete('/:id', usuariosController.removeUsuariosController);

export default router;