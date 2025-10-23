import express from 'express';
import * as usuariosController from './usuarios.controller.js';
import usuariosSchema from './usuarios.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';

const router = express.Router();

router.get('/', usuariosController.getUsuariosController);
router.get('/:id', usuariosController.getUsuariosByIdController);
router.post('/', validate(usuariosSchema), usuariosController.createUsuariosController);
router.put('/:id', validate(usuariosSchema.partial()), usuariosController.updateUsuariosController);
router.delete('/:id', usuariosController.removeUsuariosController);

export default router;