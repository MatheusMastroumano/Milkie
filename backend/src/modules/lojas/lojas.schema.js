import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

const TipoLojaEnum = z.enum(['matriz', 'filial']);

const LojasSchema = z.object({
    id: utils.id,
    nome: utils.nome,
    tipo: TipoLojaEnum.default('filial'),
    endereco: z.string(),
    ativo: z.boolean().default(true),
    criado_em: utils.riadoEm,
});

export default LojasSchema;