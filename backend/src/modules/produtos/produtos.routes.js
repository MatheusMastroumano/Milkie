import express from 'express';
import * as produtosController from './produtos.controller.js';
import { uploadImagem, uploadImagemController } from './produtos.upload.controller.js';
import produtosSchema from './produtos.schema.js';

// importação de middlewares
import validate from '../../shared/middlewares/validate.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';
import moduleAccess from '../../shared/middlewares/moduleAccess.js';

const router = express.Router();

// aplica auth e moduleAccess em todas as rotas
router.use(authMiddleware, moduleAccess('produtos'));

// Rota de upload de imagem (antes das outras rotas)
router.post('/upload-imagem', uploadImagem, uploadImagemController);

router.get('/', produtosController.getProdutosController);
router.get('/:id', produtosController.getProdutosByIdController);
router.post('/', validate(produtosSchema), produtosController.createProdutosController);
router.put('/:id', validate(produtosSchema.partial()), produtosController.updateProdutosController);
router.delete('/:id', produtosController.removeProdutosController);

export default router;