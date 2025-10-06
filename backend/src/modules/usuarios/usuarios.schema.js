import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

const FuncaoEnum = z.enum(['admin', 'gerente', 'caixa']);

const UsuariosSchema = z.object({
    id: utils.id,
    funcionario_id: utils.id,
    loja_id: utils.id,
    funcao: FuncaoEnum.default('caixa'),
    username: utils.nome,
    senha_hash: utils.string,
    ativo: z.boolean().default(true)
});

export default UsuariosSchema;