import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

const FornecedorProdutosSchema = z.object({
    fornecedor_id: utils.id,
    produto_id: utils.id,
});

export default FornecedorProdutosSchema;